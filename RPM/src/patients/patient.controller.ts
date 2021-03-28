
/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Body, Controller, HttpException, HttpStatus, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ProblemException, ResponseProblemException } from '../common';
import { AuthorizationMiddleware } from './authorization.middleware';
import { ConfirmSessionService } from './confirm-session.service';
import { MedicalTimeService } from './medical-time.service';
import { RequestBloodPressureDetailService } from './model/patient-model/request-blood-pressure-detail-service-model';
import { SetPersonalBloodPressureModel } from './model/patient-model/request-set-personal-blood-pressure-model';
import { RequestBloodPressureDetail } from './model/request-model/request-blood-pressure-detail';
import { RequestConfirmSessionId } from './model/request-model/request-confirm-session-id';
import { RequestGetMedicalTime } from './model/request-model/request-get-medical-time';
import { RequestPatientList } from './model/request-model/request-patient-list';
import { RequestSetMedicalTime } from './model/request-model/request-set-medical-time';
import { RequestSetPersonalBloodPressure } from './model/request-model/request-set-personal-blood-pressure';
import { RequestSetWeightThreshold } from './model/request-model/request-set-weight-threshold';
import { RequestUpdateHaid } from './model/request-model/request-update-haid';
import { RequestWeightDetail } from './model/request-model/request-weight-detail';
import { PatientBloodPressureDetailService } from './patient-blood-pressure-detail.service';
import { PatientCommonDetailService } from './patient-common-detail-service';
import { PatientListService } from './patient-list.service';
import { PatientPersonalBpService } from './patient-personal-blood-pressure.service';
import { PatientWeightDetailService } from './patient-weight-detail.service';
import { PatientWeightThresholdService } from './patient-weight-threshold.service';
import { UpdateHaidService } from './update-haid.service';

@Controller('dashboard')
@ApiBearerAuth()
@UseInterceptors(AuthorizationMiddleware)
export class PatientController {
  /**
   * Constructor of Patient Controller
   * @param patientCommonService PatientCommonDetailService
   * @param patientWeightDetailService PatientWeightDetailService
   * @param patientBloodPressureDetailService PatientBloodPressureDetailService
   * @param patientListService PatientListService
   * @param patientPersonalBpService PatientPersonalBpService
   * @param patientWeightThresholdService PatientWeightThresholdService
   * @param updateHaidService UpdateHaidService
   * @param confirmSessionService ConfirmSessionService
   * @param medicalTimeService MedicalTimeService
   */
  constructor(
    private readonly patientCommonService: PatientCommonDetailService,
    private readonly patientWeightDetailService: PatientWeightDetailService,
    private readonly patientBloodPressureDetailService: PatientBloodPressureDetailService,
    private readonly patientListService: PatientListService,
    private readonly patientPersonalBpService: PatientPersonalBpService,
    private readonly patientWeightThresholdService: PatientWeightThresholdService,
    private readonly updateHaidService: UpdateHaidService,
    private readonly confirmSessionService: ConfirmSessionService,
    private readonly medicalTimeService: MedicalTimeService,
  ) {

  }

  /**
   * API Common Detail.
   * @param req Request
   */
  @Post('/commonDetail')
  async commonDetail(@Req() req: Request) {
    const result = await this.patientCommonService.getCommonDetail(req);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException(result, HttpStatus.OK);
  }

  /**
   * API Patient List
   * @param req Request
   * @param body Data Request Patient List
   */
  @Post('/patientList')
  async patientList(@Req() req: Request, @Body() body: RequestPatientList) {
    // Call Api getPatientList service
    const result = await this.patientListService.getPatientList(req, body);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException(result, HttpStatus.OK);
  }

  /**
   * API Blood Pressure Detail
   * @param req Request
   * @param query RequestBloodPressureDetail
   */
  @Post('/bloodPressureDetail')
  async bloodPressureDetail(@Req() req: Request, @Body() body: RequestBloodPressureDetail) {

    // Create RequestBloodPressureDetailService with access_token,current_ha_user_id,date_from,type,date_to
    const param = new RequestBloodPressureDetailService({
      ha_user_id: req.query.current_ha_user_id,
      date_from: body.date_from,
      date_to: body.date_to,
    });
    // Call Api getbloodPressureDetail service
    const result = await this.patientBloodPressureDetailService.getbloodPressureDetail(req, param);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException(result, HttpStatus.OK);
  }

  /**
   * API Weight Detail
   * @param req Request
   * @param body Data Request Weight Detail
   */
  @Post('/weightDetail')
  async weightDetail(@Req() req: Request, @Body() body: RequestWeightDetail) {
    const result = await this.patientWeightDetailService.getWeightDetail(req, body);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException(result, HttpStatus.OK);
  }

  /**
   * API Get Personal Blood Pressure
   * @param req Request
   */
  @Post('/getPersonalBloodPressure')
  async getPersonalBloodPressure(@Req() req: Request) {
    const result = await this.patientPersonalBpService.getPersonalBloodPressure(req);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException(result, HttpStatus.OK);
  }

  /**
   * API Set Personal Blood Pressure
   * @param req Request
   * @param body Data Request Set Personal Blood Pressure
   */
  @Post('/setPersonalBloodPressure')
  async setPersonalBloodPressure(@Req() req: Request, @Body() body: RequestSetPersonalBloodPressure) {
    const param = new SetPersonalBloodPressureModel({
      ha_user_id: req.query.current_ha_user_id,
      target_sys: body.target_sys,
      target_dia: body.target_dia,
      threshold_sys: body.threshold_sys,
      threshold_dia: body.threshold_dia,
    });
    const result = await this.patientPersonalBpService.setPersonalBloodPressure(req, param);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException({ result }, HttpStatus.OK);
  }

  /**
   * API Get Weight Threshold
   * @param req Request
   */
  @Post('/getWeightThreshold')
  async getWeightThreshold(@Req() req: Request) {
    // Call Api getWeightThreshold service
    const result = await this.patientWeightThresholdService.getWeightThreshold(req);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException(result, HttpStatus.OK);
  }

  /**
   * API Set Weight Threshold
   * @param req Request
   * @param body Data Request Set Weight Threshold
   */
  @Post('/setWeightThreshold')
  async setWeightThreshold(@Req() req: Request, @Body() body: RequestSetWeightThreshold) {
    const result = await this.patientWeightThresholdService.setWeightThreshold(req, body);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException(result, HttpStatus.OK);
  }

  /**
   * Update haid when click get patient detail from patient list
   * @param req Request
   * @param body RequestUpdateHaid
   * @param res any
   */
  @Post('updateHaid')
  async updateHaid(@Req() req: Request, @Body() body: RequestUpdateHaid, @Res() res: any) {
    // Call api updateHaid from ssoService
    const result = await this.updateHaidService.updateHaid(req, body);
    if (result instanceof ProblemException) {
      // If result have type Problem then retry log and return problem
      throw new ResponseProblemException(req, result);
    }
    return res.status(HttpStatus.OK).json(result);
  }

  /**
   * Confirm session and generate access_token
   * @param req Request
   * @body id string
   * @param type string
   * @param res any
   */
  @Post('confirmSession')
  async confirmSession(@Req() req: Request, @Body() body: RequestConfirmSessionId, @Res() res: any) {
    req.query.elapsedStart = new Date().getTime();
    const result = await this.confirmSessionService.confirmSession(req, body);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    return res.status(HttpStatus.OK).json(result);
  }

  /**
   * API Set Medical Time
   * @param req Request
   * @param body Data Request Set Medical Time
   */
  @Post('setMedicalTime')
  async setMedicalTime(@Req() req: Request, @Body() body: RequestSetMedicalTime) {
    const result = await this.medicalTimeService.setMedicalTime(req, body);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException({ result }, HttpStatus.OK);
  }

  /**
   * API Get Medical Time
   * @param req Request
   * @param body Data Request Get Medical Time
   */
  @Post('getMedicalTime')
  async getMedicalTime(@Req() req: Request, @Body() body: RequestGetMedicalTime) {
    const result = await this.medicalTimeService.getMedicalTime(req, body);
    if (result instanceof ProblemException) {
      throw new ResponseProblemException(req, result);
    }
    throw new HttpException(result, HttpStatus.OK);
  }

}
