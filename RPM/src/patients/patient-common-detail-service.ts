/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import * as moment from 'moment';
import { SettingService } from '../setting/setting.service';
import { Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';
import {
  ClassificationCode, CodeType, ContractWeight, DeleteFlag, Helper, Keys,
  MessageType, OHIEntryName, Problem, ProblemException, RpmLogger, PageType,
} from '../common';
import * as Constants from '../common/constants';
import TimeUtil from '../common/time-util';
import { Result } from '../models';
import { RequestBodyGetPersonalBPInfo, RequestGetPersonalInfo, RequestGetVitalAverageData, RequestWeightInfo } from '../ohi/models/request-model';
import { OhiService } from '../ohi/ohi.service';
import { PatientAggregate } from './entity/patient-aggregate.entity';
import { PatientContract } from './entity/patient-contract.entity';
import { RequestCommonDetailPatient } from './model/patient-model';
import { CommonDetail } from './model/response-model';

export enum FieldType {
  MorningSysLatest = 'sys_avg_morning',
  MorningDiaLatest = 'dia_avg_morning',
  MorningPulseLatest = 'pulse_avg_morning',
  EveningSysLatest = 'sys_avg_evening',
  EveningDiaLatest = 'dia_avg_evening',
  EveningPulseLatest = 'pulse_avg_evening',
}

export interface Setting {
  baseDateMonth: number;
  medicalTimePollingInterval: number;
}

@Injectable()
export class PatientCommonDetailService {
  /**
   * Constructor of Patient Common Detail Service
   * @param patientAggregateRepository Repository<Patient>
   * @param patientContractRepository  Repository<PatientContract>
   * @param ohiService OhiService
   * @param settingService SettingService
   */
  constructor(
    @InjectRepository(PatientAggregate)
    private patientAggregateRepository: Repository<PatientAggregate>,
    @InjectRepository(PatientContract)
    private readonly patientContractRepository: Repository<PatientContract>,
    private readonly ohiService: OhiService,
    private readonly settingService: SettingService,
  ) { }

  // Array contains the setting variables
  settingKeys = [Keys.base_date_month, Keys.medical_time_polling_interval];

  /**
   *
   * @param req Request
   * @param param RequestCommonDetailPatient
   */
  async getCommonDetail(req: Request): Promise<CommonDetail | ProblemException> {

    // Create RequestCommonDetailPatient with ha_user_id
    const param = new RequestCommonDetailPatient({
      ha_user_id: req.query.current_ha_user_id,
      haids: req.query.ha_user_ids,
    });

    let result;
    // (1) Perform access token authentication
    // Get HA-ID list from session data
    // If the HA - ID list is not included in the session data, return an error response(99. Common error: Authentication error)
    if (isNullOrUndefined(param.ha_user_id)) {
      // Check ha_user_id = undefined or length ha_user_id = 0 return it problem.
      result = new ProblemException({
        status: HttpStatus.NOT_FOUND,
        code: CodeType.AtTheError,
        classificationCode: ClassificationCode.IsNotFound,
        messageType: MessageType.IsNotFound,
      });
      RpmLogger.warn(req, result);
      return result;
    }
    // (2) Patient information acquisition
    // 1.Information that "HeartAdvisorUserID" is corresponding to HA-ID
    let patientContract;
    // Find patient contract by ha_user_id and delete flag = 0.
    try {
      patientContract = await this.patientContractRepository.findOne({ ha_user_id: param.ha_user_id, delete_flag: DeleteFlag.No });
      // If patient contract not found
      if (!patientContract) {
        result = new ProblemException({
          status: HttpStatus.NOT_FOUND,
          code: CodeType.AtTheError,
          classificationCode: ClassificationCode.IsNotFound,
          messageType: MessageType.IsNotFound,
        });
        RpmLogger.error(req, result);
        return result;
      }
    } catch {
      // If error when query
      result = ProblemException.API_InternalServerError();
      RpmLogger.fatal(req, result);
      return result;
    }

    let summaryData: any;
    // Find patient aggregate by ha_user_id.
    try {
      summaryData = await this.patientAggregateRepository.findOneOrFail({ ha_user_id: param.ha_user_id });
    } catch {
      // If there is no patient total information
      result = ProblemException.API_InternalServerError();
      RpmLogger.fatal(req, result);
      return result;
    }

    /**
     * Personal info from OHI API
     */
    let personalInfo: any;

    /**
     * Vital Data Average from OHI API
     */
    let vitalDataAverage: any;

    /**
     * Blood Pressure Info from OHI API
     */
    let bloodPressureInfo: any;

    /**
     * Weight information acquisition from OHI API
     */
    let weightInfo: any;

    await Promise.all([
      // Request get Personal Info from OHI API.
      this.getPersonalInfo(param).catch(error => {
        return error;
      }),
      // Get Average Vital Data from OHI API.
      this.getVitalDataAverage(param).catch(error => {
        return error;
      }),
      // Get Personal BP from OHI API.
      this.getPersonalBPInfo(param).catch(error => {
        return error;
      }),
      // // Get Weight Info from OHI API.
      this.getWeightInfo(param, patientContract).catch(error => {
        return error;
      }),
    ]).then(values => {
      personalInfo = values[0];
      vitalDataAverage = values[1];
      bloodPressureInfo = values[2];
      weightInfo = values[3];
    });

    if (personalInfo instanceof ProblemException || vitalDataAverage instanceof ProblemException ||
      bloodPressureInfo instanceof ProblemException || weightInfo instanceof ProblemException) {
      result = ProblemException.API_InternalServerError();
      RpmLogger.fatal(req, result);
      return result;
    }

    // The object containing threshold settings value get from OHI
    const thresholdSettings = Helper.convertThresholdSettings(
      weightInfo?.threshold_kg, weightInfo?.threshold_lbs, weightInfo?.threshold_period, patientContract.contract_weight,
    );

    // The array containing setting value get from table m_setting_info
    const settings = await this.getMedicalTimeSettings(req, this.settingKeys);
    if (settings instanceof ProblemException) {
      RpmLogger.fatal(req, settings);
      return settings;
    }

    // "Page type" is extracted from the session data and the information to be provided is determined according to the value
    const pageType = req.query.page_type;

    // (3)The response data is made and it returns it.
    // Response common Data.
    result = new CommonDetail({
      result: new Result({ code: '0' }),
      mr_id: personalInfo?.mr_id,
      first_name: personalInfo?.first_name,
      middle_name: !isNullOrUndefined(personalInfo?.middle_name) ? personalInfo?.middle_name : undefined,
      last_name: personalInfo?.last_name,
      gender: personalInfo?.gender,
      birthday: TimeUtil.format(personalInfo.birth),
      age: personalInfo?.age,
      phone_number: !isNullOrUndefined(personalInfo?.phone_number) ? personalInfo?.phone_number : undefined,
      morning_sys_latest: Helper.average(vitalDataAverage.vital_data, FieldType.MorningSysLatest) || undefined,
      morning_dia_latest: Helper.average(vitalDataAverage.vital_data, FieldType.MorningDiaLatest) || undefined,
      morning_pulse_latest: Helper.average(vitalDataAverage.vital_data, FieldType.MorningPulseLatest) || undefined,
      evening_sys_latest: Helper.average(vitalDataAverage.vital_data, FieldType.EveningSysLatest) || undefined,
      evening_dia_latest: Helper.average(vitalDataAverage.vital_data, FieldType.EveningDiaLatest) || undefined,
      evening_pulse_latest: Helper.average(vitalDataAverage.vital_data, FieldType.EveningPulseLatest) || undefined,
      sys_threshold: !isNullOrUndefined(bloodPressureInfo?.sys_threshold) ? bloodPressureInfo?.sys_threshold : undefined,
      dia_threshold: !isNullOrUndefined(bloodPressureInfo?.dia_threshold) ? bloodPressureInfo?.dia_threshold : undefined,
      sys_target: !isNullOrUndefined(bloodPressureInfo?.goal_sys) ? bloodPressureInfo?.goal_sys : undefined,
      dia_target: !isNullOrUndefined(bloodPressureInfo?.goal_dia) ? bloodPressureInfo?.goal_dia : undefined,
      weight_kg: Helper.convertLatestWeight(weightInfo?.latest_weight_kg, patientContract.contract_weight),
      weight_lbs: Helper.convertLatestWeight(weightInfo?.latest_weight_lbs, patientContract.contract_weight),
      weight_alert: Helper.convertWeightAlert(weightInfo?.weight_alert, patientContract.contract_weight),
      before_date: Helper.convertDateTimeOfChange(weightInfo?.before_date, patientContract.contract_weight),
      after_date: Helper.convertDateTimeOfChange(weightInfo?.after_date, patientContract.contract_weight),
      threshold_kg: thresholdSettings.threshold_kg,
      threshold_lbs: thresholdSettings.threshold_lbs,
      threshold_period: thresholdSettings.threshold_period,
      rank_total: summaryData?.rank_total ? summaryData?.rank_total : 0,
      bot: summaryData.algo_alert,
      list_back: param.haids && param.haids.length > 0 ? 1 : 0,
      ha_regist_date: TimeUtil.format(patientContract.ha_regist_date),
      base_date_month: settings.baseDateMonth,
      medical_time_polling_interval: settings.medicalTimePollingInterval,
      default_display_tab: isNullOrUndefined(pageType) ? PageType.BloodPressure : +pageType,
    });
    RpmLogger.info(req, result);
    return result;
  }

  /**
   * Get Personal Information from OHI
   * @param query RequestCommonDetailPatient
   */
  private async getPersonalInfo(query: RequestCommonDetailPatient): Promise<any | ProblemException> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // 2.Information that "HeartAdvisorUserID" is corresponding to HA-ID
        // Obtain information that "HeartAdvisorUserID" matches the HA-ID of the session data from the patient total information table.
        const requestPersonalInfo = new RequestGetPersonalInfo({
          ha_user_id: [query.ha_user_id],
        });
        // 3.Following API of the OHI system is called, and patient information for the string is acquired HA-ID of the session data.
        const personalInfo = await this.ohiService.getPersonalInfo(requestPersonalInfo, OHIEntryName.ApiGetPersonalInfo);
        if (personalInfo instanceof Problem) {
          // If the patient information acquisition API returns an error,return an error response (Common error: Server internal processing error)
          reject(new ProblemException());
        }
        const result = personalInfo.data ? personalInfo.data[0] : {};
        // If have data resolve result.
        resolve(result);
      }, 0);
    });
  }

  /**
   * Get Vital Data Average from OHI
   * @param query Request Common Detail Patient
   */
  private async getVitalDataAverage(query: RequestCommonDetailPatient): Promise<any | ProblemException> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // Format type start by YYYY-MM-DDT00:00:00
        const start = moment().subtract(7, 'days').format('YYYY-MM-DD') + Constants.TIME_START_DATE;
        // OHI-IDN_API_Spec_20191229.xlsx - Sheet getVitalAverageData
        // Specify the end date and time of the acquisition period.
        // The specified date and time are processed as Local time according to the patient's time zone.
        const end = moment().subtract(1, 'days').format('YYYY-MM-DD') + Constants.TIME_END_DATE;
        // 5.Following API of the OHI system is called, and the vital average data for the string is acquired HA-ID.
        const requestVitalAverageData = new RequestGetVitalAverageData({
          ha_user_id: query.ha_user_id,
          start,
          end,
        });
        const vitalAvg = await this.ohiService.getVitalAverageData(requestVitalAverageData, OHIEntryName.ApiGetVitalAverageData);
        if (vitalAvg instanceof Problem) {
          // If the vital average data acquisition API returns an error, return an error response (Common error: Server internal processing error)
          reject(new ProblemException());
        }
        // If have data resolve vital Data
        resolve(vitalAvg);
      }, 0);
    });
  }

  /**
   * Get Personal Blood Pressure Info from OHI
   * @param query Request Common Detail Patient
   */
  private async getPersonalBPInfo(query: RequestCommonDetailPatient): Promise<any | ProblemException> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // 6.Following API of the OHI system is called, and the blood pressure of the target in which the string is acquired HA-ID
        const requestPersonalBPInfo = new RequestBodyGetPersonalBPInfo({
          ha_user_id: [query.ha_user_id],
        });
        const personalBpData = await this.ohiService.getPersonalBPInfo(requestPersonalBPInfo, OHIEntryName.ApiGetPersonalBPInfo);
        // Check personalBpData have Problem
        if (personalBpData instanceof Problem) {
          reject(new ProblemException());
        }
        // Check PersonalBpData.bp_info exist.
        const personalBp = (personalBpData.bp_info && personalBpData.bp_info.length > 0) ? personalBpData.bp_info[0] : {};
        // If have data return it Personal blood pressure
        resolve(personalBp);
      }, 0);
    });
  }

  /**
   * Function GetWeightInfo from OHI
   * @param query RequestCommonDetailPatient
   * @param patientContract PatientContract
   */
  private async getWeightInfo(query: RequestCommonDetailPatient, patientContract: PatientContract): Promise<any | ProblemException> {

    return new Promise((resolve, reject) => {
      setTimeout(async () => {

        if (patientContract.contract_weight === ContractWeight.No) {
          // If contract_weight = 0 return it undefined.
          resolve(undefined);
        }

        // The request object to send to OHI
        const requestWeightInfo = new RequestWeightInfo({
          ha_user_id: [query.ha_user_id],
        });
        // The object containing weight information from OHI
        const weightInfo = await this.ohiService.getWeightInfo(requestWeightInfo, OHIEntryName.ApiGetWeightInfo);
        if (weightInfo instanceof Problem) {
          // Return ProblemException if cannot get data from OHI
          reject(new ProblemException());
        }
        // Return array data from OHI
        const weightDataOHI = weightInfo.data ? weightInfo.data[0] : {};
        resolve(weightDataOHI);
      }, 0);
    });
  }

  /**
   * Function get medical time settings from database
   * @param req Request
   * @param settingKeys Array containing keys need to get from DB
   */
  async getMedicalTimeSettings(req: Request, settingKeys: string[]): Promise<Setting | ProblemException> {
    let setting: Setting;
    try {
      const medicalTimeSettings = await this.settingService.getValueByKeys(settingKeys);
      if (medicalTimeSettings instanceof ProblemException) {
        return ProblemException.API_InternalServerError();
      }
      // Get data from setting table, if value is empty => log fatal return
      const baseDate = medicalTimeSettings.find(r => r.setting_key === Keys.base_date_month)?.setting_value;
      if (isNullOrUndefined(baseDate)) {
        return this.logFatal(req, Keys.base_date_month);
      }

      const medTimePollingInterval = medicalTimeSettings.find(r => r.setting_key === Keys.medical_time_polling_interval)?.setting_value;
      if (isNullOrUndefined(medTimePollingInterval)) {
        return this.logFatal(req, Keys.medical_time_polling_interval);
      }

      // map setting value to number,
      setting = {
        baseDateMonth: +baseDate,
        medicalTimePollingInterval: +medTimePollingInterval,
      };
      return setting;
    } catch (ex) {
      const result = ProblemException.API_InternalServerError();
      RpmLogger.fatal(req, result);
      return result;
    }
  }

  /**
   * Log fatal
   * @param req Request
   * @param message message
   */
  logFatal(req: Request, message = '') {
    const result = ProblemException.API_InternalServerError();
    RpmLogger.fatal(req, result, message);
    return result;
  }
}
