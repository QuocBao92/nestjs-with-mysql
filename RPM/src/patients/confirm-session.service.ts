/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';
import * as Enums from '../common';
import {
    ClassificationCode, CodeType, ErrorType, Helper, MessageField,
    MessageType, OHIEntryName, Problem, ProblemException, ProcessingType, RpmLogger,
} from '../common';
import { Result } from '../models';
import { RequestHeartAdvisorUserId } from '../ohi/models/request-model';
import { GetHeartAdvisorUserIdModel } from '../ohi/models/response-model';
import { OhiService } from '../ohi/ohi.service';
import { SettingService } from '../setting/setting.service';
import { TableSession } from '../sso/entity/table_session.entity';
import { RequestConfirmSessionId } from './model/request-model/request-confirm-session-id';

export class ConfirmSessionService {
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
        private readonly ohiService: OhiService) {
    }

    // [6] SessionID
    /**
     * Confirm session when first time redirect
     * @body sessionId
     */
    async confirmSession(req: Request, body: RequestConfirmSessionId): Promise<any> {
        let result;
        if (req.headers['content-type'] !== 'application/json' && req.headers['content-type'] !== 'application/json; charset=utf-8') {
            result = new ProblemException({
                status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                errorType: ErrorType.B,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIforDoctorDashboard,
                classificationCode: ClassificationCode.ContentsIsIllegal,
                message: 'Generic error - The request entity has a media type which the server or resource does not support.',
            });
            RpmLogger.info(req, result);
            return result;
        }

        // Input check. If SessionID is not specified, return an error response.
        if (isNullOrUndefined(body.sessionId) || typeof (body.sessionId) !== 'string' || body.sessionId.length === 0) {
            result = ProblemException.Unauthorized_SessionIDCertificationFailed();
            RpmLogger.info(req, result);
            return result;
        }

        // session object on table SessionTable
        let session: TableSession;
        try {
            // Find sesion from database by session id
            session = await this.sessionRepository.findOne({ where: { session_id: body.sessionId.toString() } });
            if (isNullOrUndefined(session)) {
                // If no matching record is found from the SessionID management table, return an error response.
                result = ProblemException.Unauthorized_SessionIDCertificationFailed();
                RpmLogger.info(req, result);
                return result;
            }
        } catch {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }

        const date = new Date().getTime();

        // Check if it has expired
        if (date > session.exp_date) {
            // If current date subtraction expiration date more than session period then return it problem.
            result = ProblemException.Forbidden_SessionIDHasExpired();
            RpmLogger.info(req, result);
            return result;
        }

        let tokenPeriod;
        let retryTimes;
        let retryInterval;
        try {
            const masterData = await this.settingService.getValueByKeys(
                ['token_period', 'doctor_dashboard_retry_times', 'doctor_dashboard_retry_interval']);
            if (masterData instanceof ProblemException) {
                result = ProblemException.API_InternalServerError();
                RpmLogger.fatal(req, result);
                return result;
            }

            tokenPeriod = +(masterData.find(m => m.setting_key === 'token_period').setting_value) * 1000;

            // Get setting config for front-end
            retryTimes = +masterData.find(m => m.setting_key === 'doctor_dashboard_retry_times').setting_value;
            retryInterval = +masterData.find(m => m.setting_key === 'doctor_dashboard_retry_interval').setting_value;
        } catch (ex) {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }

        const info = JSON.parse(session.login_data);
        if (info.screen_type !== undefined && (info.screen_type !== Enums.ScreenType.ListPatient
            && info.screen_type !== Enums.ScreenType.PatientDetail)) {
            // Check type not equal undefined and type not equal ListPatient and type not equal PatientDetail
            result = new ProblemException({
                status: HttpStatus.NOT_FOUND,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.AttestationError,
                messageType: MessageType.IsNotFound,
                fields: MessageField.ScreenType,
            });
            RpmLogger.error(req, result);
            return result;
        }
        // Processing when "redirect" of login information is patient list screen
        if (info.screen_type === Enums.ScreenType.ListPatient) {
            if (isNullOrUndefined(info.ha_user_ids)) {
                // Issue HeartAdvisorUserID acquisition API to acquire HA-ID
                const requestHaid = new RequestHeartAdvisorUserId({
                    ehr_id: info.ehr_id,
                    npi_id: info.npi_id,
                });

                // call getHAID from OHI
                const resultHaids = await this.ohiService.getHAID(requestHaid, OHIEntryName.ApiGetHAID);
                if (resultHaids instanceof Problem && resultHaids.status === HttpStatus.BAD_REQUEST) {
                    result = new ProblemException({
                        status: HttpStatus.UNAUTHORIZED,
                        code: CodeType.AtTheError,
                        classificationCode: ClassificationCode.AttestationError,
                        messageType: MessageType.SessionIDCertificationFailed,
                    });
                    RpmLogger.error(req, result);
                    return result;
                }

                if (resultHaids instanceof Problem && resultHaids.status !== HttpStatus.BAD_REQUEST) {
                    result = ProblemException.API_InternalServerError();
                    RpmLogger.error(req, result);
                    return result;
                }
                const data = new GetHeartAdvisorUserIdModel(resultHaids)?.data;
                const haids: any[] = data && data.map(p => p.ha_user_id) || [];

                // update ha_user_id and current_ha_user_id
                info.ha_user_ids = haids;
                info.current_ha_user_id = info.mr_id && haids ? haids[0] : undefined;
            }
        }
        // Processing when the "redirect destination" of the login information is the patient details screen
        if (info.screen_type === Enums.ScreenType.PatientDetail) {
            if (isNullOrUndefined(info.current_ha_user_id)) {
                // Issue HeartAdvisorUserID acquisition API to acquire HA-ID
                const requestHaid = new RequestHeartAdvisorUserId({
                    ehr_id: info.ehr_id,
                    npi_id: info.npi_id,
                    mr_id: info.mr_id,
                });

                // call getHAID from OHI
                const resultHaids = await this.ohiService.getHAID(requestHaid, OHIEntryName.ApiGetHAID);
                if (resultHaids instanceof Problem && resultHaids.status === HttpStatus.BAD_REQUEST) {
                    return new ProblemException({
                        status: HttpStatus.NOT_FOUND,
                        code: CodeType.AtTheError,
                        classificationCode: ClassificationCode.IsNotFound,
                        messageType: MessageType.IsNotFound,
                    });
                }

                if (resultHaids instanceof Problem && resultHaids.status !== HttpStatus.BAD_REQUEST) {
                    result = ProblemException.API_InternalServerError();
                    RpmLogger.error(req, result);
                    return result;
                }
                const haids: any[] = new GetHeartAdvisorUserIdModel(resultHaids)?.data.map(p => p.ha_user_id);

                // update ha_user_id and current_ha_user_id
                info.ha_user_ids = info.mr_id ? undefined : haids;
                info.current_ha_user_id = haids ? haids[0] : undefined;
            }
        }

        const tokenExpire = new Date((new Date()).getTime() + tokenPeriod).getTime();
        let accessToken;
        if (isNullOrUndefined(session.access_token) || session.access_token.length === 0) {
            // Generate accessToken
            accessToken = Helper.randomString(64) + moment().valueOf().toString(36);
        }

        const ss = new TableSession();
        ss.session_id = body.sessionId;
        ss.access_token = accessToken ? accessToken : session.access_token;
        ss.login_data = JSON.stringify(info);
        ss.exp_date = session.access_token ? +session.exp_date : tokenExpire;
        try {
            await this.sessionRepository.save(ss);
        } catch {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }

        result = {
            result: new Result({ code: '0' }),
            access_token: accessToken ? accessToken : session.access_token,
            exp_date: session.access_token ? +session.exp_date : tokenExpire,
            config: {
                doctor_dashboard_retry_times: retryTimes,
                doctor_dashboard_retry_interval: retryInterval,
            },
        };
        RpmLogger.info(req, result);
        return result;

    }
}
