/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JWK, JWT } from '@panva/jose';
import { Request, Response } from 'express';
import * as moment from 'moment';
import { Repository, Connection } from 'typeorm';
import { isNullOrUndefined } from 'util';
import { Helper, OHIEntryName, Problem, ProblemException, RpmLogger } from '../common';
import * as Enums from '../common/enums';
import { RequestHeartAdvisorUserId } from '../ohi/models/request-model';
import { GetHeartAdvisorUserIdModel } from '../ohi/models/response-model';
import { OhiService } from '../ohi/ohi.service';
import { SettingService } from '../setting/setting.service';
import { TableSession } from './entity/table_session.entity';

export enum ReturnUrl {
  InternalServerError = '/InternalServerError',
  AuthFailed = '/AuthFailed',
}
@Injectable()
export class SsoService {
  /**
   * Constructor of Single Sign On Service
   * @param settingService SettingService
   * @param sessionRepository Repository<TableSession>
   * @param ohiService OhiService
   */
  constructor(
    private readonly settingService: SettingService,
    @InjectRepository(TableSession)
    private readonly sessionRepository: Repository<TableSession>,
    private readonly ohiService: OhiService,
    private readonly connection: Connection) { }

  /**
   * Login
   * @param req Request
   * @param resp Response
   */
  async login(req: Request, res: Response): Promise<any> {
    let location = `${process.env.BASE_FRONTEND_URL}`;
    // Check variable enviroment
    if (!process.env.REDOX_SECRET_KEY || !process.env.REDOX_AUDIENCE || !process.env.REDOX_ISSUER) {
      res.set('Location', location + ReturnUrl.InternalServerError);
      return ProblemException.SSO_InternalServerError();
    }
    // Create key information from authentication key
    const key = JWK.asKey(Buffer.from(process.env.REDOX_SECRET_KEY));

    // Get token from request header
    let idToken: any = req.headers.authorization;
    if (!idToken || !idToken.startsWith('Bearer ')) {
      res.set('Location', location + ReturnUrl.AuthFailed);
      return ProblemException.SSO_AuthFailed();
    }
    // Remove leading Bearer
    idToken = idToken.replace('Bearer ', '');
    let payload;
    try {
      // JWT authentication
      JWT.verify(idToken, key, {
        audience: process.env.REDOX_AUDIENCE,
        issuer: process.env.REDOX_ISSUER,
        clockTolerance: '1 min', // Expiration date (1 minute)
      });
      // Extract hospital ID and patient ID
      payload = JWT.decode(idToken, { complete: true }).payload;
    } catch {
      res.set('Location', location + ReturnUrl.AuthFailed);
      // Returns HTTP code "401 Unauthorized" when login fails.
      return ProblemException.SSO_AuthFailed();
    }

    // If the hospital ID does not include any of the doctor IDs, a login error occurs
    if (payload === undefined) {
      res.set('Location', location + ReturnUrl.AuthFailed);
      return ProblemException.SSO_AuthFailed();
    }

    // Hospital ID in JWT
    const ehrId = payload.patient_ids.find(p => p.id_type === 'EHRID')?.id;
    // Doctor ID in JWT
    const npiId = payload.npi;
    // Patient ID in JWT
    const mrId = payload.patient_ids.find(p => p.id_type === 'MR')?.id;
    // page type is RpmDashboard field
    const pageType = Number.isInteger(+(req.body.RpmDashboard)) ? +(req.body.RpmDashboard) : req.body.RpmDashboard;
    if (!isNullOrUndefined(pageType) && !(pageType in Enums.PageType)) {
      res.set('Location', location + ReturnUrl.AuthFailed);
      return ProblemException.SSO_AuthFailed();
    }

    if (ehrId === undefined && npiId === undefined) {
      res.set('Location', location + ReturnUrl.AuthFailed);
      // If the hospital ID does not include any of the doctor IDs, a login error occurs
      return ProblemException.SSO_AuthFailed();
    }

    // Issue HeartAdvisorUserID acquisition API to acquire HA-ID
    const requestHaid = new RequestHeartAdvisorUserId({
      ehr_id: !isNullOrUndefined(ehrId) ? ehrId : undefined,
      npi_id: !isNullOrUndefined(npiId) ? npiId : undefined,
      mr_id: !isNullOrUndefined(mrId) ? mrId : undefined,
    });

    // call getHAID from OHI
    const resultHaids = await this.ohiService.getHAID(requestHaid, OHIEntryName.ApiGetHAID);
    let haids;

    if (!requestHaid.mr_id && resultHaids.status === 400) {
      res.set('Location', location + ReturnUrl.AuthFailed);
      return ProblemException.SSO_AuthFailed();
    }

    if (resultHaids instanceof Problem && resultHaids.status !== 400) {
      res.set('Location', location + ReturnUrl.InternalServerError);
      return ProblemException.SSO_InternalServerError();
    }

    const data = !(resultHaids instanceof Problem) && new GetHeartAdvisorUserIdModel(resultHaids)?.data || [];
    haids = data && data.map(p => p.ha_user_id) || [];

    // Login information, hospital ID, doctor ID, HA-ID. JSON format
    let info;
    info = JSON.stringify({
      ehr_id: ehrId,
      npi_id: npiId,
      mr_id: mrId,
      ha_user_ids: mrId ? undefined : haids,
      current_ha_user_id: mrId && haids ? haids[0] : undefined,
      screen_type: mrId ? Enums.ScreenType.PatientDetail : Enums.ScreenType.ListPatient,
      page_type: pageType,
    });

    // Generate session id
    const sessionId = Helper.randomString(64) + moment().valueOf().toString(36);
    let sessionPeriod;
    try {
      sessionPeriod = +await this.settingService.getValueByKey('session_period') * 1000;
    } catch (ex) {
      const result = ProblemException.SSO_InternalServerError();
      RpmLogger.fatal(req, result);
      res.set('Location', location + ReturnUrl.InternalServerError);
    }
    const expire = new Date((new Date()).getTime() + sessionPeriod).getTime();

    // [3]Issue SessionID, hospital ID, doctor ID record, SessionID management table,
    try {
      const ss = new TableSession();
      ss.exp_date = expire;
      ss.login_data = info;
      ss.session_id = sessionId;
      await this.sessionRepository.save(ss);
    } catch {
      res.set('Location', location + ReturnUrl.InternalServerError);
      return ProblemException.SSO_InternalServerError();
    }

    // If there is a patient ID, make the redirect URL patient details
    // If there is no patient ID, the redirect URL is used as the patient list

    // 3.Respond 302 to HTTP POST, set Location header to the unique sign-in URL of the application and respond
    location = location + `/ConfirmSessionId?id=${encodeURIComponent(sessionId)}&type=${JSON.parse(info).screen_type}`;

    // Set the redirect URL with SessionID as a GET parameter in the HTTP header (as a parameter of "Location")
    // and respond to Redox with a status code 302.
    res.set('Location', location);
    res.status(HttpStatus.FOUND).send();
    return;
  }

  // [10] Access token confirmation
  /**
   * Validate in AuthorizationMiddleware
   * @param req
   */
  async validateRequest(req: Request): Promise<boolean | ProblemException> {
    const auth = req.headers.authorization;

    // If authorization not exist return it problem.
    if (auth === undefined) {
      const result = ProblemException.Forbidden_AuthFailed();
      RpmLogger.info(req, result);
      return result;
    }
    const accessToken = auth.replace('Bearer ', '');

    let session: TableSession;
    const masterQueryRunner = this.connection.createQueryRunner('master');
    try {
      session = await this.connection.createQueryBuilder(TableSession, 'd_session')
        .setQueryRunner(masterQueryRunner).where({ access_token: accessToken }).getOne();
    } catch (ex) {
      const result = ProblemException.Forbidden_AuthFailed();
      RpmLogger.fatal(req, result);
      return result;
    } finally {
      await masterQueryRunner.release();
    }

    // If ss not exist return it problem.
    if (isNullOrUndefined(session)) {
      const result = ProblemException.Unauthorized_AuthFailed();
      RpmLogger.info(req, result);
      return result;
    }

    const date = new Date().getTime();
    if (date > session.exp_date) {
      const result = ProblemException.Unauthorized_TokenExpired();
      RpmLogger.info(req, result);
      return result;
    }

    let info;
    try {
      info = JSON.parse(session.login_data);
    } catch (ex) {
      const result = ProblemException.BadRequest_JSONIsNotCorrect();
      RpmLogger.info(req, result);
      return result;
    }

    req.query.ehr_id = info.ehr_id;
    req.query.mr_id = info.mr_id;
    req.query.npi_id = info.npi_id;

    // Will check if call patient detail...
    req.query.ha_user_ids = info.ha_user_ids;

    // Will check if call patient list
    req.query.current_ha_user_id = info.current_ha_user_id;

    req.query.screen_type = info.screen_type;
    req.query.page_type = info.page_type;

    req.query.access_token = accessToken;

    return true;
  }
}
