/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import * as Constants from '../common/constants';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import { Connection, LessThan, Repository } from 'typeorm';
import { Logger } from '../common/cloudwatch-logs';
import { InformationOnSideEffect } from '../ohi/models/response-model/get-side-effect-info/information_on_side_effect';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNullOrUndefined } from 'util';
import { OhiService } from '../ohi/ohi.service';
import { PatientAggregate } from '../patients/entity/patient-aggregate.entity';
import { SettingService } from '../setting/setting.service';
import { TableSession } from '../sso/entity/table_session.entity';
import { TempPatientAggregate } from '../patients/entity/temp_patient_aggregate.entity';
import { TempPatientAggregateDaily } from '../patients/entity/temp_patient_aggregate_daily.entity';
import { VitalInformationBlood } from '../ohi/models/response-model/get-vital-data/vital-information-blood';
import {
  ClassificationCode,
  ErrorCode,
  ErrorType,
  Helper,
  Problem,
  ProcessingType,
  PointRankCalculate,
  ProblemException,
  VitalData,
  ContractApplication,
  Keys,
  IrregularHeartbeat,
  DeleteFlag,
  BatchEntryName,
  OHIEntryName,
  RuleNumbers,
  AlertNoticeFlag,
  IsBatchRunningStatus,
} from '../common';
import {
  RequestBodySendBPAlert,
  RequestGetVitalAverageData,
  RequestGetVitalData,
  RequestSideEffectInfo,
  RequestBodyGetPersonalBPInfo,
} from '../ohi/models/request-model';

export interface Setting {
  rankH: number;
  rankL: number;
  rankM: number;
  ohiRetryTime: number;
  ohiRetryInterval: number;
}
@Injectable()
export class BatchService {
  setting;
  settingKeys: Keys[] = [Keys.rank_m_lower, Keys.rank_l_lower, Keys.rank_h_lower, Keys.ohi_retry_times, Keys.ohi_retry_interval];

  /**
   * Contrucstor of Batch Service
   * @param patientAggregateRepository Repository<PatientAggregate>
   * @param tableSessionRepository Repository<TableSession>
   * @param tempPatientAggregateDailyRepository Repository<TempPatientAggregateDaily>
   * @param tempPatientAggregateRepository Repository<TempPatientAggregate>
   * @param ohiService OhiService
   * @param settingService SettingService
   * @param logger Logger
   */
  constructor(
    // Repositories
    @InjectRepository(PatientAggregate)
    private readonly patientAggregateRepository: Repository<PatientAggregate>,

    @InjectRepository(TableSession)
    private readonly tableSessionRepository: Repository<TableSession>,

    @InjectRepository(TempPatientAggregateDaily)
    private readonly tempPatientAggregateDailyRepository: Repository<TempPatientAggregateDaily>,

    @InjectRepository(TempPatientAggregate)
    private readonly tempPatientAggregateRepository: Repository<TempPatientAggregate>,
    // Service
    private readonly ohiService: OhiService,
    private readonly settingService: SettingService,

    private connection: Connection,
  ) {

    // Set enviroment config value from file.
    const environment = process.env.NODE_ENV;
    const envFile = path.resolve(__dirname, '../../../config/', `${environment}.env`);
    const envConfig = dotenv.parse(fs.readFileSync(envFile));

    Object.keys(envConfig).forEach(key => {
      process.env[key] = envConfig[key];
    });

  }

  /**
   * Remove all session expire
   */
  async removeSessionExpire(): Promise<void> {
    Logger.info('START', BatchEntryName.BatchDeleteSession);
    const currentDay = new Date();
    const hourOfTime = Constants.TIME_EXPIRE_CACHE / 3600000; // time remove
    currentDay.setHours(currentDay.getHours() - hourOfTime);
    const dt = Date.parse(currentDay.toString());
    try {
      await this.tableSessionRepository.delete({ exp_date: LessThan(dt) });

      Logger.debug('', BatchEntryName.BatchDeleteSession);

    } catch (ex) {
      Logger.fatal(
        '', BatchEntryName.BatchDeleteSession, {}, this.getErrorContent999(ClassificationCode.InternalError, RuleNumbers.BatchDeleteSession));
    }
    Logger.info('END', BatchEntryName.BatchDeleteSession);
    return;
  }

  // Auto run job to caculator and summary data every day at 3:00 AM
  /**
   * handle CronJobs everyday
   */
  async handleCronJobs(): Promise<void> {
    // Log start batch vital sumary
    Logger.info('START', BatchEntryName.BatchVital); // begin run batch vitual

    // Set enviroment config value from file.
    const environment = process.env.NODE_ENV;
    const envFile = path.resolve(__dirname, '../../../config', `${environment}.env`);
    const envConfig = dotenv.parse(fs.readFileSync(envFile));
    Object.keys(envConfig).forEach(key => {
      process.env[key] = envConfig[key];
    });
    // Get setting values by setting keys
    this.setting = await this.GetSettingValues(this.settingKeys);
    if (this.setting instanceof ProblemException) {
      Logger.fatal('', BatchEntryName.BatchVital, {}, this.getErrorContent(ClassificationCode.DbMasterError, RuleNumbers.BatchVital));
      Logger.info('END', BatchEntryName.BatchVital);
      process.env.isBatchRunning = IsBatchRunningStatus.OFF;
      // End run batch vitual
      return;
    }

    try {
      // TRUNCATE all data batch temporary
      await this.tempPatientAggregateRepository.query('TRUNCATE  temp_patient_aggregate;');
      await this.tempPatientAggregateDailyRepository.query('TRUNCATE  temp_patient_aggregate_daily;');

      const lastBatchAggregateDate = new Date().toISOString().slice(0, 10);
      // Insert data into temporary table
      await this.tempPatientAggregateRepository.query('INSERT INTO temp_patient_aggregate \
      SELECT d_patient_aggregate.* FROM d_patient_aggregate \
      INNER JOIN d_patient_contract ON d_patient_aggregate.ha_user_id = d_patient_contract.ha_user_id \
      WHERE d_patient_contract.delete_flag = 0 AND (last_aggregate_date <> ? OR last_aggregate_date IS NULL)', [lastBatchAggregateDate]);

    } catch (ex) {
      this.logInternalError();
      process.env.isBatchRunning = IsBatchRunningStatus.OFF;
      Logger.info('END', BatchEntryName.BatchVital);
      // End run batch vitual
      return;
    }
    // Get list patient to caculator summary data
    const patients = await this.runStep1();

    if (!patients) {
      Logger.info('END', BatchEntryName.BatchVital);
      process.env.isBatchRunning = IsBatchRunningStatus.OFF;
      // End run batch vitual
      return;
    }

    const currentDay = new Date();
    const previousDay = new Date(currentDay.setDate(currentDay.getDate() - 1)); // the previous day run batch
    const start = moment().subtract(7, 'days').format('YYYY-MM-DD').slice(0, 10) + Constants.TIME_START_DATE;
    const end = previousDay.toISOString().slice(0, 10) + Constants.TIME_END_DATE;
    /**
     * list ha_user_id updated temporary blood pressure successfully
     */
    let haids = [];

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      const haid = await this.calculateBloodPressure(patient, start, end).catch(err => {
        return err;
      });
      haids.push(haid);
    }

    haids = haids.filter(h => !(h instanceof Problem));
    /**
     * - Update data from temporary table to origin table
     * - updated successfully: true, error: false
     */
    await this.updateFromTempTableToOrigin(haids);
    // Delete the record registered in the temporary table of the user who has completed batch processing
    await this.clearTemporaryTable().catch(err => {
      process.env.isBatchRunning = IsBatchRunningStatus.OFF;
      this.logInternalError();
      return err;
    });
    Logger.info('END', BatchEntryName.BatchVital);
    process.env.isBatchRunning = IsBatchRunningStatus.OFF;
    // Send alert message if Update data from temporary table to origin table successfully
    await this.alertMessage();
    return;
  }

  /**
   * Update from temporary table to origin
   */
  async updateFromTempTableToOrigin(haUserIds: string[]): Promise<string[] | Problem> {
    try {
      const haids = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < haUserIds.length; i++) {
        const haid = haUserIds[i];
        //#region transaction
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          // Insert and Update data from temporary Patient Aggregate Daily table to prime table
          await queryRunner.query('INSERT INTO d_patient_aggregate_daily SELECT * FROM temp_patient_aggregate_daily as temp \
        WHERE temp.ha_user_id = ? \
        ON DUPLICATE KEY UPDATE \
          measurement_date = temp.measurement_date, rank_total = temp.rank_total,\
          algo1 = temp.algo1, algo2 = temp.algo2, algo3 = temp.algo3, algo4 = temp.algo4, algo5 = temp.algo5', [haid]);
          // Insert and Update data from temp Patient Aggregate Daily table to prime table
          await queryRunner.query('INSERT INTO d_patient_aggregate \
        SELECT * FROM temp_patient_aggregate as temp\
        WHERE temp.ha_user_id = ? \
        ON DUPLICATE KEY UPDATE \
          last_aggregate_date = temp.last_aggregate_date,\
          ha_request_timestamp = temp.ha_request_timestamp,\
          last_meas_date = temp.last_meas_date,\
          day_sys_latest = temp.day_sys_latest,\
          day_dia_latest = temp.day_dia_latest,\
          day_pulse_latest = temp.day_pulse_latest,\
          threshold_excess_num = temp.threshold_excess_num,\
          meas_num = temp.meas_num,\
          target_sys = temp.target_sys,\
          target_dia = temp.target_dia,\
          threshold_sys = temp.threshold_sys,\
          threshold_dia = temp.threshold_dia,\
          ihb_rate = temp.ihb_rate,\
          side_effect_rate = temp.side_effect_rate,\
          rank_total = temp.rank_total,\
          rank_sys = temp.rank_sys,\
          rank_dia = temp.rank_dia,\
          rank_pulse = temp.rank_pulse,\
          rank_excess_rate = temp.rank_excess_rate,\
          rank_ihb_rate = temp.rank_ihb_rate,\
          rank_side_effect_rate = temp.rank_side_effect_rate,\
          point_sys = temp.point_sys, \
          point_dia = temp.point_dia,\
          point_pulse = temp.point_pulse, \
          point_excess_rate = temp.point_excess_rate, \
          point_ihb_rate = temp.point_ihb_rate, \
          point_side_effect_rate = temp.point_side_effect_rate, \
          algo_alert = temp.algo_alert, \
          alert_notice_flag = temp.alert_notice_flag', [haid]);
          // Commit transaction now:
          await queryRunner.commitTransaction();
          haids.push(haid);
        } catch (err) {
          // Since we have errors lets rollback changes we made
          await queryRunner.rollbackTransaction();
        } finally {
          // You need to release query runner which is manually created:
          await queryRunner.release();
        }
        //#endregion transaction
      }

      return haids;
    } catch (err) {
      this.logInternalError();
      return new Problem();
    }
  }
  /**
   * Remove temporary table after calc
   */
  async clearTemporaryTable() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // All temporary data TRUNCATE
          if (process.env.APP_DEBUG !== 'true') {
            try {
              await this.tempPatientAggregateRepository.query('TRUNCATE  temp_patient_aggregate;');
              await this.tempPatientAggregateDailyRepository.query('TRUNCATE  temp_patient_aggregate_daily;');
            } catch (ex) {
              this.logInternalError();
              reject();
            }
          }
          resolve();
        } catch (ex) {
          this.logInternalError();
          reject();
        }
      }, 0);
    });
  }

  /**
   * This function caculate sumary data for one user
   * @param patient : any
   * @param start : string (start day)
   * @param end : string (end day)
   */
  async calculateBloodPressure(patient: any, start: string, end: string): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        //#region calculate Blood Pressure
        // Running parallel
        let step2and3and4Result;
        let step5and6Result;
        let step7and8Result;
        await Promise.all([
          this.runStep2AndStep3AndStep4(patient.ha_user_id, start, end).catch(e => {
            // Log error when runStep2AndStep3AndStep4 return problem
            this.logInternalError();
            return e;
          }),
          this.runStep5And6(patient, start, end).catch(e => {
            // Log error when runStep5And6 return problem
            this.logInternalError();
            return e;
          }),
          this.runStep7And8(patient, start, end).catch(e => {
            // Log error when runStep7And8 return problem
            this.logInternalError();
            return e;
          }),
        ]).then(values => {

          step2and3and4Result = values[0];
          step5and6Result = values[1];
          step7and8Result = values[2];

        }).catch((err) => {
          this.logInternalError();
          return err;
        });

        // if result of step (2, 3, 4), (5, 6) or (7, 8) is Problem or undefined
        [step2and3and4Result, step5and6Result, step7and8Result].forEach(result => {
          if (result instanceof Problem) {
            reject(result);
          }
        });

        // Step: 9 Calculation of auto triage rank
        const step9Result = await this.runStep9(patient.ha_user_id, end);
        if (step9Result instanceof Problem || !step9Result) {
          reject(step9Result);
        }

        resolve(patient.ha_user_id);

        //#endregion calculate Blood Pressure
      }, 0);
    });
  }

  /**
   * Send alert message when caculator finish
   * Send alert for user when detect alert (if cannot send will log)
   */
  async alertMessage(): Promise<void | Problem> {

    // Get alert data user from patient aggregate and patient contract
    let patientAggregates: PatientAggregate[];
    try {
      const query = 'SELECT \
        origin.ha_user_id, \
        origin.last_aggregate_date, \
        origin.day_sys_latest, \
        origin.day_dia_latest, \
        origin.threshold_sys, \
        origin.threshold_dia, \
        origin.rank_total, \
        origin.update_date \
      FROM d_patient_aggregate as origin \
      INNER JOIN d_patient_contract \
      ON d_patient_contract.ha_user_id = origin.ha_user_id \
      WHERE d_patient_contract.delete_flag = 0 \
        AND origin.alert_notice_flag = ? ;';

      patientAggregates = await this.patientAggregateRepository.query(query, [AlertNoticeFlag.NotNotified]);
    } catch (ex) {
      // Get data from database error
      Logger.fatal(
        '', BatchEntryName.BatchAlert, {}, this.getErrorContent999(ClassificationCode.InternalError, RuleNumbers.BatchAlert));
      return new Problem();
    }

    if (patientAggregates.length > 0) {
      Logger.info('START', BatchEntryName.BatchAlert);

      // Send alert notice based on the obtained d_patient_aggregate
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < patientAggregates.length; i++) {
        const patientAggregate = patientAggregates[i];
        await this.sendAlertMessage(patientAggregate).catch((err) => {
          return err;
        });
      }
      Logger.info('END', BatchEntryName.BatchAlert);
    }
    return;
  }

  /**
   * Send alert for user when detect alert (if cannot send will log)
   * Chiled function of alertMessage
   * @param pAggregate : PatientAggregate (Alert notification patient information )
   */
  async sendAlertMessage(pAggregate: PatientAggregate): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const alertReq = new RequestBodySendBPAlert({
          ha_user_id: pAggregate.ha_user_id,
          sys_average: pAggregate.day_sys_latest,
          dia_average: pAggregate.day_dia_latest,
          sys_threshold: pAggregate.threshold_sys,
          dia_threshold: pAggregate.threshold_dia,
          date: moment(pAggregate.update_date).unix(),
        });

        const alertRes = await this.ohiService.sendBPAlert(
          alertReq, OHIEntryName.ApiSendBPAlert, true, this.setting.ohiRetryTime, this.setting.ohiRetryInterval);

        if (alertRes instanceof Problem) {
          Logger.error(JSON.stringify({
            code:
              this.getErrorContent(ClassificationCode.OhiError, RuleNumbers.BatchAlert).result,
          }), BatchEntryName.BatchAlert);
          reject(alertRes);

        } else {
          Logger.debug('', BatchEntryName.BatchAlert, alertReq, alertRes);
          // Update alert_notice_flag
          try {
            await this.patientAggregateRepository.save({
              alert_notice_flag: AlertNoticeFlag.Notified,
              ha_user_id: pAggregate.ha_user_id,
            });
          } catch (ex) {
            Logger.fatal('', BatchEntryName.BatchAlert,
              { ha_user_id: pAggregate.ha_user_id }, this.getErrorContent999(ClassificationCode.InternalError, RuleNumbers.BatchAlert));
            reject(ex);
          }
          resolve();
        }
      }, 0);
    });
  }

  //#region  STEP 1-> 9

  /**
   * (1) Identification of target users
   */
  async runStep1(): Promise<PatientAggregate[]> {
    try {
      const lastBatchAggregateDate = new Date().toISOString().slice(0, 10);
      return await this.tempPatientAggregateRepository.query(
        'SELECT `d_patient_contract`.`ha_user_id`,`d_patient_contract`.`contract_application` \
         FROM `d_patient_contract`,`d_patient_aggregate` \
         WHERE `d_patient_contract`.`delete_flag` = 0 \
           AND `d_patient_contract`.`ha_user_id` = `d_patient_aggregate`.`ha_user_id` \
           AND ( `d_patient_aggregate`.`last_aggregate_date` IS NUll OR \
           `d_patient_aggregate`.`last_aggregate_date` <> ? )', [lastBatchAggregateDate]) as PatientAggregate[];
    } catch (ex) {
      this.logInternalError();
      return undefined;
    }
  }

  /**
   * Calculate Step 2, 3 , 4
   * @param haUserId:  string
   * @param start : string (start day)
   * @param end : string (end day)
   */
  async runStep2AndStep3AndStep4(haUserId: string, start: string, end: string): Promise<true | Problem> {
    // Step (2) Acquisition of target blood pressure and threshold blood pressure
    // Call OHI API parallel
    // Call the following API of the OHI system to obtain the target blood pressure and threshold blood pressure.
    // Call the following API of the OHI system to acquire blood pressure vital data.
    let bpInfo: any;
    let vitalDataBlood: any;
    await Promise.all([
      // Get Personal Info from OHI API.
      this.getBPInfor(haUserId).catch(error => {
        return error;
      }),
      // Get Average Vital Data from OHI API.
      this.getVitalData(haUserId, start, end).catch(error => {
        return error;
      }),
    ]).then(values => {
      bpInfo = values[0];
      vitalDataBlood = values[1];
    });

    if (bpInfo instanceof ProblemException || vitalDataBlood instanceof ProblemException) {
      return new Problem();
    }

    // Save data to temporary patient aggregate
    try {
      await this.tempPatientAggregateRepository.save({
        ...{
          target_sys: !isNullOrUndefined(bpInfo.goal_sys) ? bpInfo.goal_sys : null,
          target_dia: !isNullOrUndefined(bpInfo.goal_dia) ? bpInfo.goal_dia : null,
          threshold_sys: !isNullOrUndefined(bpInfo.sys_threshold) ? bpInfo.sys_threshold : null,
          threshold_dia: !isNullOrUndefined(bpInfo.dia_threshold) ? bpInfo.dia_threshold : null,
        },
        ha_user_id: haUserId,
      });
    } catch (ex) {
      this.logInternalError();
      return new Problem();
    }

    // Step (4) Tabulation of blood pressure vital data
    let thresholdExcessNum = 0;
    // [3] Tally the “irregular pulse wave generation rate”.
    let ihbPulse = 0;
    /**
     *  Number times of blood pressure measurement before check deleted flag
     */
    let measNum = vitalDataBlood.vital_data.length;
    let ihbRate = 0;
    //  If the "measNum" is 0, "irregular pulse wave generation ratio" is NULL.
    if (measNum === 0) {
      ihbRate = null;
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < vitalDataBlood.vital_data.length; j++) {
        const vitalData = vitalDataBlood.vital_data[j] as VitalInformationBlood;
        // [1] the data whose [deletion flag] is “1: deleted” are excluded
        if (vitalData.delete === DeleteFlag.Yes) {
          // if delete flag = 1, number times of blood pressure measurement not count
          measNum = measNum - 1;
          continue;
        }
        // Check threshold sys and threshold dia not null.
        if (!isNullOrUndefined(bpInfo.sys_threshold) && !isNullOrUndefined(bpInfo.dia_threshold)) {
          if (vitalData.sys >= bpInfo.sys_threshold || vitalData.dia >= bpInfo.dia_threshold) {
            thresholdExcessNum = thresholdExcessNum + 1;
          }
        }
        // Count the number of measurement results of [1: Arrhythmia presence]
        if (vitalData.ihb === IrregularHeartbeat.Yes) {
          ihbPulse = ihbPulse + 1;
        }
      }

      // [Arrhythmia presence / absence] with "1: Arrhythmia present",
      // Divide by the number of blood pressure measurements counted, and calculate the percentage (rounded to the first decimal place)
      if (measNum !== 0) {
        ihbRate = Math.round(ihbPulse / measNum * 100);

      } else {
        ihbRate = null;
      }
    }
    // (2) Aggregate the number of times the blood pressure threshold is exceeded
    // If both “sys_threshold” and “dia_threshold” null OR threshold sys null OR threshold dia null
    // The “thresholdExcessNum” and "measurement count" are set to NULL.
    if (isNullOrUndefined(bpInfo.sys_threshold) || isNullOrUndefined(bpInfo.dia_threshold)) {
      thresholdExcessNum = null;
      measNum = null;
    }
    // Register the total number of “blood pressure measurement”, “number of times of exceeding blood pressure threshold”,
    // And “irregular pulse wave generation ratio” in “Patient total information table”.
    try {
      await this.tempPatientAggregateRepository.save({

        threshold_excess_num: thresholdExcessNum,
        meas_num: measNum,
        ihb_rate: ihbRate,
        ha_user_id: haUserId,

      });
      return true;

    } catch (ex) {
      this.logInternalError();
      return new Problem();
    }

  }

  /**
   * Calculate Blood Step 5 And 6
   * (5) Acquisition date of side effect
   * (6) Side effects occurrence rate aggregation
   * @param patient patient any
   * @param start : string (start day)
   * @param end string (end day)
   */
  async runStep5And6(patient: any, start: string, end: string): Promise<true | Problem> {
    // Step (5) Acquisition date of side effect
    // If “Smartphone application presence” of “HeartAdvisorUserID” acquired in step 1 is “1: Yes”,
    // Call the following API of the OHI system to acquire “Side effect occurrence date”.

    if (patient.contract_application === ContractApplication.Yes) {
      const requestSideEffectInfo = new RequestSideEffectInfo({
        ha_user_id: patient.ha_user_id,
        start,
        end,
      });
      // This API gets side effect information
      const sideEffectInfo = await this.ohiService.getSideEffectInfo(
        requestSideEffectInfo, OHIEntryName.ApiGetSideEffectInfo, true, this.setting.ohiRetryTime, this.setting.ohiRetryInterval);
      if (sideEffectInfo instanceof Problem) {
        Logger.error(
          JSON.stringify({ code: this.getErrorContent(ClassificationCode.OhiError, RuleNumbers.BatchVital).result }), BatchEntryName.BatchVital);
        return sideEffectInfo;
      }

      // Step(6) Side effects occurrence rate aggregation
      const lstsideEffectDays = []; // total will = 0 when innit
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < sideEffectInfo.side_effect_info.length; i++) {
        const sideEffects = sideEffectInfo.side_effect_info[i] as InformationOnSideEffect;
        // If take_date not NULL, check the side effect date and count.
        if (sideEffects.take_date !== null) {
          // Convert take_date to string with format YYYY-MM-DD
          const dateT = sideEffects.take_date.toString().slice(0, 10);
          lstsideEffectDays.push(dateT);
        }
      }
      const sideEffectCount = lstsideEffectDays.length;
      // Convert the [side effect date] obtained in (5) into days, divide by "7 (= 7 days: fixed value)",
      // And calculate the percentage (round off the first decimal point).
      const sideEFRate = Math.round((sideEffectCount / Constants.NUMBER_DAY) * 100);

      // Save data into temporary table
      try {
        await this.tempPatientAggregateRepository.save({
          side_effect_rate: sideEFRate,
          ha_user_id: patient.ha_user_id,
        });
        return true;
      } catch (ex) {
        this.logInternalError();
        return new Problem();
      }

    } else {
      // If “Smartphone application presence / absence” of “HeartAdvisorUserID” acquired in (1) is “0: nothing”, NULL is registered.
      // Save data into temporary table
      try {
        await this.tempPatientAggregateRepository.save({
          side_effect_rate: null,
          ha_user_id: patient.ha_user_id,
        });

        return true;
      } catch (ex) {
        this.logInternalError();
        return new Problem();
      }
    }
  }

  /**
   * Calculate Blood Step (7) (8)
   * (7) Acquisition of blood pressure vital average data
   * (8) Aggregation of blood pressure vital data
   * @param patient any
   * @param start : string (start day)
   * @param end string (end day)
   */
  async runStep7And8(patient: any, start: string, end: string): Promise<true | Problem> {

    const requestVitalAverage = new RequestGetVitalAverageData({
      // HeartAdvisorUserID
      ha_user_id: patient.ha_user_id,
      // count: It doesn't specify
      // beginning date : API request receipt date
      start,
      // Day before day of this batch execution- "23:59:59" is specified at time.
      end,
    });

    // Call the following API of the OHI system to obtain the average value of blood pressure vital data.
    const vitalAverage = await this.ohiService.getVitalAverageData(
      requestVitalAverage, OHIEntryName.ApiGetVitalAverageData, true, this.setting.ohiRetryTime, this.setting.ohiRetryInterval);
    if (vitalAverage instanceof Problem) {
      Logger.error(
        JSON.stringify({ code: this.getErrorContent(ClassificationCode.OhiError, RuleNumbers.BatchVital).result }), BatchEntryName.BatchVital);
      return vitalAverage;
    }

    // Step 8 total of blood pressure vital mean value data
    // Average on maximal pressure nearest day
    const daySysLatest = Helper.average(vitalAverage.vital_data, 'sys_avg_day');
    // Average on minimal pressure nearest day
    const dayDiaLatest = Helper.average(vitalAverage.vital_data, 'dia_avg_day');
    // Average on pulse nearest day
    const dayPulseLatest = Helper.average(vitalAverage.vital_data, 'pulse_avg_day');
    // Update db "Patient total information table"
    try {
      await this.tempPatientAggregateRepository.save({
        ...{
          day_sys_latest: daySysLatest,
          day_dia_latest: dayDiaLatest,
          day_pulse_latest: dayPulseLatest,
        },
        ha_user_id: patient.ha_user_id,
      });
      return true;
    } catch (ex) {
      this.logInternalError();
      return new Problem();
    }
  }

  /**
   * Calculate Blood Step (9)
   * (9) Calculation of auto triage rank
   * @param haUserId string
   * @param end string (end day)
   */
  async runStep9(haUserId: string, end: string): Promise<true | Problem> {
    let patient;
    const masterQueryRunner = this.connection.createQueryRunner('master');
    try {
      patient = await this.connection.createQueryBuilder(TempPatientAggregate, 'temp_patient_aggregate')
        .setQueryRunner(masterQueryRunner).where({ ha_user_id: haUserId }).getOne();
    } finally {
      await masterQueryRunner.release();
    }

    if (!patient) {
      return new Problem();
    }

    // The auto triage rank is calculated based on the calculating formula shown since next page.
    // (blood pressure threshold excess frequency ÷ Number of blood pressure measurements) ×100
    // If Number of blood pressure threshold excess frequency is null, blood pressure measurements NULL or 0 then excessRate is NULL
    let excessRate;
    if (patient.meas_num === 0 || patient.meas_num === null || patient.threshold_excess_num === null) {
      excessRate = null;
    } else {
      excessRate = patient.threshold_excess_num / patient.meas_num * 100;
    }

    let pointSBP;
    let pointDBP;
    let rankSys;
    let rankDia;

    // If "target systolic blood pressure", "target diastolic blood pressure", "threshold systolic blood pressure",
    // And "threshold diastolic blood pressure" do not exist as a set, both SBP / DBP treat points and rank as NULL.
    if (isNullOrUndefined(patient.target_sys)
      || isNullOrUndefined(patient.target_dia)
      || isNullOrUndefined(patient.threshold_sys)
      || isNullOrUndefined(patient.threshold_dia)) {
      pointSBP = null;
      pointDBP = null;
      rankSys = null;
      rankDia = null;
    } else {
      // Average of systolic blood pressure
      pointSBP = PointRankCalculate.getPointRankSBP(patient.day_sys_latest, patient.threshold_sys, patient.target_sys, this.setting);
      // Average of diatolic blood pressure
      pointDBP = PointRankCalculate.getPointRankDBP(patient.day_dia_latest, patient.threshold_dia, patient.target_dia, this.setting);
      // Average on blood pressure sys nearest day
      rankSys = PointRankCalculate.checkRank(pointSBP, this.setting);
      // Average on blood pressure sys nearest day
      rankDia = PointRankCalculate.checkRank(pointDBP, this.setting);
    }

    // Average of the most recent pulse
    const pointPulse = PointRankCalculate.getPointRankPulse(patient.day_pulse_latest, this.setting);
    // Blood pressure threshold excess rate
    const pointExcessRate = PointRankCalculate.getPointRankHightbpMeas(excessRate, this.setting);
    // Irregular pulse wave generation rate
    const pointIhb = PointRankCalculate.getPointRankIHB(patient.ihb_rate, this.setting);
    // Auto triage rank (Rate of occurrence of _eff effects)
    const pointSideEffectRate = PointRankCalculate.getPointRankSideEffects(patient.side_effect_rate, this.setting);

    // Average on pulse nearest day
    const rankPulse = PointRankCalculate.checkRank(pointPulse, this.setting);
    // Side effect rate
    const rankSideEffectRate = PointRankCalculate.checkRank(pointSideEffectRate, this.setting);
    // Irregular pulse wave generation ratio
    const rankIbhRate = PointRankCalculate.checkRank(pointIhb, this.setting);
    // Blood pressure threshold excess ratio
    const rankExcessRate = PointRankCalculate.checkRank(pointExcessRate, this.setting);

    // Auto triage rank
    const rankTotal = PointRankCalculate.getRankTotal(rankSys, rankDia);
    let alertNoticeFlag = AlertNoticeFlag.NotRequired;
    if (rankTotal === Constants.RANK_TOTAL_ALERT) {
      // With alert: Blood pressure alert notification required.
      alertNoticeFlag = AlertNoticeFlag.NotNotified;
    }

    try {
      await this.tempPatientAggregateDailyRepository.save({
        ...{
          rank_total: rankTotal,
        },
        ha_user_id: patient.ha_user_id,
        measurement_date: end.slice(0, 10),
      });
    } catch (ex) {
      this.logInternalError();
      return new Problem();
    }
    try {
      await this.tempPatientAggregateRepository.save({
        ...{
          rank_sys: rankSys,
          rank_dia: rankDia,
          rank_pulse: rankPulse,
          rank_side_effect_rate: rankSideEffectRate,
          rank_ihb_rate: rankIbhRate,
          rank_excess_rate: rankExcessRate,
          rank_total: rankTotal,
          alert_notice_flag: alertNoticeFlag,
          point_sys: pointSBP,
          point_dia: pointDBP,
          point_excess_rate: pointExcessRate,
          point_pulse: pointPulse,
          point_ihb_rate: pointIhb,
          point_side_effect_rate: pointSideEffectRate,
        },
        ha_user_id: patient.ha_user_id,
      });
    } catch (ex) {
      this.logInternalError();
      return new Problem();
    }

    // Step（１0）	Update on the final total day
    // When all the processing of this batch ends normally, "Vital data finality total day"
    // and "Vital data finality measurement day" are updated.
    // Vital data finality total day
    // Vital data finality measurement day
    // When all the processing of this batch ends normally, "Vital data finality total day" and "Vital data finality measurement day" are updated.
    try {
      await this.tempPatientAggregateRepository.save({
        ...{
          last_aggregate_date: new Date().toISOString().slice(0, 10),
          last_meas_date: end.slice(0, 10),
        },
        ha_user_id: haUserId,
      });
      return true;
    } catch (ex) {
      // Log error save db
      this.logInternalError();
      return new Problem();
    }
  }

  //#endregion STEP 1-> 9

  /**
   * Get Blood Pressure Information
   * @param haUserId string
   */
  private async getBPInfor(haUserId: string): Promise<any | ProblemException> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const requestPersonalBPInfo = new RequestBodyGetPersonalBPInfo({
          ha_user_id: [haUserId],
        });
        const personalBpData = await this.ohiService.getPersonalBPInfo(
          requestPersonalBPInfo, OHIEntryName.ApiGetPersonalBPInfo, true, this.setting.ohiRetryTime, this.setting.ohiRetryInterval);
        // Check personalBpData have Problem
        if (personalBpData instanceof Problem) {
          Logger.error(JSON.stringify({
            code: this.getErrorContent(ClassificationCode.OhiError, RuleNumbers.BatchVital).result,
          }), BatchEntryName.BatchVital);
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
   * Get VitalData
   * @param haUserId string
   * @param start string
   * @param end string
   */
  private async getVitalData(haUserId: string, start: string, end: string): Promise<any | ProblemException> {

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const requestVitalData = new RequestGetVitalData({
          // 1: Blood pressure
          type: VitalData.BloodPressureType,
          // 3: Automatic operation & person input
          input_type: VitalData.AutomaticAndManualInputType,
          // HeartAdvisorUserID
          ha_user_id: haUserId,
          // 1:Measurement date
          date_type: VitalData.MeasurementDateType,
          // beginning date : API request receipt date
          start,
          // end date: API request receipt date
          end,
        });
        const vitalData = await this.ohiService.getVitalData(
          requestVitalData, OHIEntryName.ApiGetVitalData, true, this.setting.ohiRetryTime, this.setting.ohiRetryInterval);
        if (!(vitalData instanceof Problem)) {
          // If vitalData is Problem
          resolve(vitalData);
        } else {
          Logger.error(JSON.stringify({
            code: this.getErrorContent(ClassificationCode.OhiError, RuleNumbers.BatchVital).result,
          }), BatchEntryName.BatchVital);
          // Reject ProblemException
          reject(new ProblemException());
        }
      }, 0);
    });
  }

  /**
   * Acquire get setting values from the setting information master table.
   * @param settingKeys : array
   */
  async GetSettingValues(settingKeys: string[]): Promise<Setting | ProblemException> {
    let setting: Setting;
    try {
      const settingValues = await this.settingService.getValueByKeys(settingKeys);
      if (settingValues instanceof ProblemException) {
        return settingValues;
      }
      // Get data from setting table, if value is empty => log fatal return
      const rankL = settingValues.find(r => r.setting_key === Keys.rank_l_lower)?.setting_value;
      if (isNullOrUndefined(rankL)) {
        Logger.fatal(
          Keys.rank_l_lower, BatchEntryName.BatchVital, {}, this.getErrorContent(ClassificationCode.DbMasterError, RuleNumbers.BatchVital));
        return new ProblemException();
      }
      const rankM = settingValues.find(r => r.setting_key === Keys.rank_m_lower)?.setting_value;
      if (isNullOrUndefined(rankM)) {
        Logger.fatal(
          Keys.rank_m_lower, BatchEntryName.BatchVital, {}, this.getErrorContent(ClassificationCode.DbMasterError, RuleNumbers.BatchVital));
        return new ProblemException();

      }
      const rankH = settingValues.find(r => r.setting_key === Keys.rank_h_lower)?.setting_value;
      if (isNullOrUndefined(rankH)) {
        Logger.fatal(
          Keys.rank_h_lower, BatchEntryName.BatchVital, {}, this.getErrorContent(ClassificationCode.DbMasterError, RuleNumbers.BatchVital));
        return new ProblemException();

      }

      const ohiRetryTime = settingValues.find(r => r.setting_key === Keys.ohi_retry_times)?.setting_value;
      if (isNullOrUndefined(ohiRetryTime)) {
        Logger.fatal(
          Keys.ohi_retry_times, BatchEntryName.BatchVital, {}, this.getErrorContent(ClassificationCode.DbMasterError, RuleNumbers.BatchVital));
        return new ProblemException();

      }
      const ohiRetryInterval = settingValues.find(r => r.setting_key === Keys.ohi_retry_interval)?.setting_value;
      if (isNullOrUndefined(ohiRetryInterval)) {
        Logger.fatal(
          Keys.ohi_retry_interval, BatchEntryName.BatchVital, {}, this.getErrorContent(ClassificationCode.DbMasterError, RuleNumbers.BatchVital));
        return new ProblemException();

      }
      // map setting value to number,
      setting = {
        rankL: +rankL,
        rankM: +rankM,
        rankH: +rankH,
        ohiRetryTime: +ohiRetryTime,
        ohiRetryInterval: +ohiRetryInterval,
      };

      return setting;
    } catch (ex) {
      Logger.fatal('', BatchEntryName.BatchVital, {}, this.getErrorContent(ClassificationCode.DbMasterError, RuleNumbers.BatchVital));
      return new ProblemException();
    }
  }

  //#region Common error
  /**
   * Implement common for log internal server error
   * @param ex error catch
   * @param message message for log
   */
  public logInternalError(message = '') {
    Logger.fatal(
      message, BatchEntryName.BatchVital, {}, this.getErrorContent999(ClassificationCode.InternalError, RuleNumbers.BatchVital));
  }

  /**
   * Return internal error content
   */
  public getErrorContent(code: ClassificationCode = ClassificationCode.InternalError, processingNumber?: number) {
    return {
      result: {
        code: ErrorCode.generalErrorCode(null, ProcessingType.BatchProcessing,
          ErrorType.A, code, 0, processingNumber),
      },
    };
  }
  public getErrorContent999(code: ClassificationCode = ClassificationCode.InternalError, processingNumber?: number) {
    return {
      result: {
        code: ErrorCode.generalErrorCode(null, ProcessingType.BatchProcessing,
          ErrorType.A, code, 0, processingNumber),
        message: 'Internal server error',
      },
    };
  }

  //#endregion

  //#region In change request requirement, Algo not use
  /**
   * (9) Acquisition of blood pressure vital data necessary for blood pressure algo abnormality determination
   * (10) Blood pressure algo abnormality judgment
   * CalculateBlood Step9And10
   * @param haUserId : patient id
   * @param start : start day
   * @param end: end day
   */
  // async calculateBloodStep9And10(haUserId: string, start: string, end: string): Promise<any> {
  //   const startStep9 = moment(end).subtract(10, 'days').format('YYYY-MM-DD').slice(0, 10) + Constants.TIME_START_DATE;
  //   const requestVitalAverageStep9 = new RequestGetVitalAverageData({
  //     // HAID
  //     ha_user_id: haUserId,
  //     // beginning date : API request receipt date
  //     start: startStep9,
  //     // ending date : API request receipt date
  //     end,
  //     // count - It doesn't specify it.
  //   });

  //   // Vital average data acquisition API
  //   const vitalAverageDataStep9 = await this.ohiService.getVitalAverageData(requestVitalAverageStep9, EntryName.BatchVital);

  //   if (vitalAverageDataStep9 instanceof Problem) { // check if request ohi problem
  //     return Problem;
  //   }
  //   Logger.debug('', EntryName.BatchVital, requestVitalAverageStep9, vitalAverageDataStep9);
  //   const dataAveBlood = CalculationSummaryData.getAveDataBlood(vitalAverageDataStep9.vital_data);
  //   // Perform only when "Measurement date" is valid.
  //   const numDate = CalculationSummaryData.getNumDateFromStartEnd(start, end);
  //   const startVitalData = numDate > 30 ? CalculationSummaryData.subtractDates(end, 30) + Constants.TIME_START_DATE : start;
  //   // Vital data acquisition API
  //   const requestVitalDataStep9 = new RequestGetVitalData({
  //     // 1:Blood pressure
  //     type: 1,
  //     // 3:Automatic operation & person input
  //     input_type: 3,
  //     // HeartAdvisorUserID
  //     ha_user_id: haUserId,
  //     // 1:Measurement date
  //     date_type: 1,
  //     // Blood pressure vital data acquisition of Kon MAX30 day since date of record soon/
  //     // Dated on the day before of the 30th of this batch execution day- "00:00:00" is specified at time.
  //     start: startVitalData,
  //     // Acquisition beginning date
  //     end,
  //   });

  //   const vitalDataStep9 = await this.ohiService.getVitalData(requestVitalDataStep9, EntryName.BatchVital);
  //   if (vitalDataStep9 instanceof Problem) { // if get vital data problem
  //     return Problem;
  //   }
  //   Logger.debug('', EntryName.BatchVital, requestVitalDataStep9, vitalDataStep9);
  //   const dataBlood = CalculationSummaryData.getVitalDataBlood(vitalDataStep9);

  //   // Step: 10 Blood pressure algo abnormality judgment
  //   // 1. API that the Argo offer base offers is called,
  //   // and the blood pressure Argo abnormality judgment is judged based on the response.
  //   const requestDetectUpTrend = new RequestDetectUpTrend({ data: dataAveBlood });
  //   // algo1: detectUpTrendBp
  //   const algo1 = await this.algoService.detectUpTrendBp(requestDetectUpTrend, EntryName.BatchVital);
  //   if (algo1 instanceof Problem) {
  //     return Problem;
  //   }
  //   Logger.debug('', EntryName.BatchVital, requestDetectUpTrend, algo1);

  //   // Algo2 detectDownTrendBP
  //   const requestDetectDownTrendBp = new RequestDetectDownTrendBp({ data: dataAveBlood });
  //   const algo2 = await this.algoService.detectDownTrendBP(requestDetectDownTrendBp, EntryName.BatchVital);
  //   if (algo2 instanceof Problem) {
  //     return Problem;
  //   }
  //   Logger.debug('', EntryName.BatchVital, requestDetectDownTrendBp, algo2);

  //   // Algo3 detectContraryTrendsBPandPulse
  //   const requestDetectContraryTrend = new RequestDetectContraryTrendsBpAndPulse({ data: dataAveBlood });
  //   const algo3 = await this.algoService.detectContraryTrendsBPandPulse(requestDetectContraryTrend, EntryName.BatchVital);
  //   if (algo3 instanceof Problem) {
  //     return Problem;
  //   }
  //   Logger.debug('', EntryName.BatchVital, requestDetectContraryTrend, algo3);

  //   // Algo4 detectBradycardia
  //   const requestDetectBradycarDiaTrend = new RequestDetectBradycarDia({ data: dataBlood });
  //   const algo4 = await this.algoService.detectBradycardia(requestDetectBradycarDiaTrend, EntryName.BatchVital);
  //   if (algo4 instanceof Problem) {
  //     return Problem;
  //   }
  //   Logger.debug('', EntryName.BatchVital, requestDetectBradycarDiaTrend, algo4);

  //   // Algo5 detectLowBP
  //   const requestDetectLowBP = new RequestDetectLowBP({ data: dataBlood });
  //   const algo5 = await this.algoService.detectLowBP(requestDetectLowBP, EntryName.BatchVital);

  //   if (algo5 instanceof Problem) {
  //     return Problem;
  //   }
  //   Logger.debug('', EntryName.BatchVital, requestDetectLowBP, algo5);

  //   // 3.The priority level of the blood pressure Argo abnormality judgment is as follows.
  //   // 4.The priority level of the blood pressure Argo abnormality judgment is as follows. he blood pressure Argo abnormality
  //   // judgment does by all of the five patterns,and registers the result in "It is a patient total information table every day".
  //   // save db table origin
  //   try {
  //     const dateMeasurement = new Date();
  //     dateMeasurement.setDate(dateMeasurement.getDate() - 1);
  //     await this.tempPatientAggregateDailyRepository.save({
  //       ...{
  //         algo1: algo1 ? JSON.stringify(algo1) : '',
  //         algo2: algo2 ? JSON.stringify(algo2) : '',
  //         algo3: algo3 ? JSON.stringify(algo3) : '',
  //         algo4: algo4 ? JSON.stringify(algo4) : '',
  //         algo5: algo5 ? JSON.stringify(algo5) : '',
  //       },
  //       ha_user_id: haUserId,
  //       measurement_date: dateMeasurement.toISOString().slice(0, 10),
  //     });
  //   } catch (ex) {
  //     Logger.error('', EntryName.BatchVital,
  //       {
  //         content: ErrorCode.generalErrorCode(null, ProcessingType.BatchProcessing,
  //           ErrorType.A, ClassificationCode.InternalError),
  //       }, ex);
  //     Logger.fatal('', EntryName.BatchVital, {
  //       algo1: algo1 ? JSON.stringify(algo1) : '',
  //       algo2: algo2 ? JSON.stringify(algo2) : '',
  //       algo3: algo3 ? JSON.stringify(algo3) : '',
  //       algo4: algo4 ? JSON.stringify(algo4) : '',
  //       algo5: algo5 ? JSON.stringify(algo5) : '',
  //     });
  //     return false;
  //   }

  //   // 5.The result of the blood pressure Argo abnormality judgment is registered and the result isregistered
  //   // in "Patient total information table" according to the priority level of
  //   // algo4 > algo3 > algo1 > algo2 > algo5
  //   const algoAlert = CalculationSummaryData.checkAlgorithmBp(algo1, algo2, algo3, algo4, algo5);
  //   try {
  //     await this.tempPatientAggregateRepository.save({
  //       algo_alert: algoAlert,
  //       ha_user_id: haUserId,
  //     });
  //     return algoAlert;
  //   } catch (ex) {
  //     Logger.error('', EntryName.BatchVital,
  //       {
  //         content: ErrorCode.generalErrorCode(null, ProcessingType.BatchProcessing,
  //           ErrorType.A, ClassificationCode.InternalError),
  //       }, ex);
  //     return false;
  //   }
  // }
  //#endregion

}
