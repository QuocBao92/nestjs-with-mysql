/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';
import {
  BloodPressureDetailExcerptNo, ClassificationCode, CodeType,
  Helper, MessageType, Problem, ProblemException, MessageField,
  VitalData, MeasurementState, MeasStateStatus, InputType, DeleteFlag, ContractApplication, IrregularHeartbeat, BodyMovement, Cuff,
  OHIEntryName,
  RpmLogger,
} from '../common';
import { Result } from '../models';
import {
  RequestGetTakingMedicineInfo, RequestGetVitalAverageData, RequestGetVitalData,
  RequestPrescriptionInfo, RequestSideEffectInfo,
} from '../ohi/models/request-model';
import { GetPrescriptionInfo, GetSiteEffectInfo, GetTakingMedicineInfo, GetVitalAverageData, GetVitalDataModel } from '../ohi/models/response-model';
import { MedicinesInformation } from '../ohi/models/response-model/get-prescription-info/medicines-information';
import { VitalInformationBlood } from '../ohi/models/response-model/get-vital-data/vital-information-blood';
import { OhiService } from '../ohi/ohi.service';
import { PatientAggregateDaily } from './entity/patient-aggregate-daily.entity';
import { PatientContract } from './entity/patient-contract.entity';
import { RequestBloodPressureDetailService } from './model/patient-model/request-blood-pressure-detail-service-model';
import { BloodPressureDetail } from './model/response-model/blood-pressure-detail';
import { AverageInformation } from './model/response-model/blood-pressure-detail/average-infromation';
import { BloodPressureInformation } from './model/response-model/blood-pressure-detail/blood-information';
import { GraphInformation } from './model/response-model/blood-pressure-detail/graph-information';
import { MedicationInformation } from './model/response-model/blood-pressure-detail/medication-information';
import * as Constants from '../common/constants';
import TimeUtil from '../common/time-util';
import { Request } from 'express';
@Injectable()
export class PatientBloodPressureDetailService {

  /**
   * Constructor of Patient Blood Pressure Detail Service
   * @param patientContractRepository Repository<PatientContract>
   * @param ohiService OhiService
   * @param patientAggregateDailyRepository Repository<PatientAggregateDaily>
   */
  constructor(
    @InjectRepository(PatientContract)
    private readonly patientContractRepository: Repository<PatientContract>,
    private readonly ohiService: OhiService,
    @InjectRepository(PatientAggregateDaily)
    private readonly patientAggregateDailyRepository: Repository<PatientAggregateDaily>,
  ) {

  }

  // Patient details blood pressure API
  /**
   * Get Blood Pressure Detail
   * @param query Request Blood Pressure Detail Service
   */
  async getbloodPressureDetail(req: Request, param: RequestBloodPressureDetailService): Promise<any | ProblemException> {
    let result;
    //#region (1) Perform access token authentication
    // Get HA-ID list from session data
    // If the HA - ID list is not included in the session data, return an error response(99. Common error: Authentication error)
    if (isNullOrUndefined(param.ha_user_id)) {
      result = new ProblemException({
        status: HttpStatus.NOT_FOUND,
        code: CodeType.AtTheError,
        classificationCode: ClassificationCode.IsNotFound,
        messageType: MessageType.IsNotFound,
      });
      RpmLogger.warn(req, result);
      return result;
    }
    //#endregion

    //#region (2) Input check
    // Check variable input
    const val = await this.checkRequest(param);
    if (val instanceof ProblemException) {
      return val;
    }
    //#endregion

    //#region Init variables

    /**
     * Vital data acquisition (Vital information (blood pressure))
     */
    let resVitalData: GetVitalDataModel;

    /**
     * Side effect information acquisition
     */
    let resSideEffectData: GetSiteEffectInfo;

    /**
     * Taking Drug Information Acquisition
     */
    let resMedicineInfo: GetTakingMedicineInfo;

    /**
     * Vital average data acquisition
     */
    let resVitalAverageData: GetVitalAverageData;

    /**
     * Get prescription info
     */
    let resPrescriptionInfo: GetPrescriptionInfo;

    //#endregion

    //#region (3) Patient information acquisition

    let patientContract;
    try {
      patientContract = await this.patientContractRepository.findOne({ ha_user_id: param.ha_user_id, delete_flag: DeleteFlag.No });
      // If patient contract not found
      if (!patientContract) {
        return new ProblemException({
          status: HttpStatus.NOT_FOUND,
          code: CodeType.AtTheError,
          classificationCode: ClassificationCode.IsNotFound,
          messageType: MessageType.IsNotFound,
        });
      }
    } catch {
      // If error when connect DB
      const err = ProblemException.API_InternalServerError();
      RpmLogger.fatal(req, err);
      return err;
    }

    let aggregateDaily;
    try {
      // From the daily patient total information table, "HeartAdvisorUserID" matches the HA-ID in the session data, and acquire
      // information that includes the measurement date in the acquisition period.
      aggregateDaily = await this.patientAggregateDailyRepository.find({
        where: qb => {
          qb.where({
            ha_user_id: param.ha_user_id,
            measurement_date: MoreThanOrEqual(param.date_from),
          }).andWhere({
            measurement_date: LessThanOrEqual(param.date_to),
          });
        },
      });
    } catch (error) {
      // If error when connect DB
      const err = ProblemException.API_InternalServerError();
      RpmLogger.fatal(req, err);
      return err;
    }

    // Call the following API of the OHI system and acquire vital data linked to the HA-ID of the session data.
    await Promise.all([
      // Get vital data from ohi.
      this.getVitalData(param)
        .catch(error => {
          return error;
        }),
      // get vital average data from ohi.
      this.getVitalAverageData(param)
        .catch(error => {
          return error;
        }),
      // Get information side effect from ohi.
      this.getSideEffectInfo(param, patientContract.contract_application)
        .catch(error => {
          return error;
        }),
      // Get medicine information from ohi.
      this.getTakingMedicineInfo(param, patientContract.contract_application)
        .catch(error => {
          return error;
        }),
      // Get prescription information from ohi.
      this.getPrescriptionInfo(param)
        .catch(error => {
          return error;
        }),
    ]).then(values => {
      // If data acquisition succeeded
      resVitalData = values[0] as GetVitalDataModel;
      resVitalAverageData = values[1] as GetVitalAverageData;
      resSideEffectData = values[2] as GetSiteEffectInfo;
      resMedicineInfo = values[3] as GetTakingMedicineInfo;
      resPrescriptionInfo = values[4] as GetPrescriptionInfo;
    });
    if (resVitalData instanceof ProblemException || resSideEffectData instanceof ProblemException || resMedicineInfo instanceof ProblemException
      || resVitalAverageData instanceof ProblemException || resPrescriptionInfo instanceof ProblemException) {
      return ProblemException.API_InternalServerError();
    }

    //#endregion

    //#region 1-3. Sorting
    // The measurement date is sorted in the descending order as a key
    //   To become a high rank on the same measurement day, automatic operation/person input/examination
    //      room input flag sorts vital data of "3"/examination room input.
    //   The date and time of creation is made a key when two or more vital data of "3"/examination
    //      room input exists on the same day and those vital data is sorted in the descending order
    // Fix for US_IDN-194 QA No.55
    resVitalData.vital_data.sort((a, b) => (
      +TimeUtil.format(b.date * 1000, b.timezone, false, true) - +TimeUtil.format(a.date * 1000, a.timezone, false, true) ||
      this.sortInputType(a, b)
    ));

    //#endregion

    //#region Init variables
    /**
     * - raw_data: Detailed blood pressure information array
     */
    const rawData = [];

    /**
     * - daily_data: Blood pressure daily average information array
     */
    const dailyData = [];

    /**
     * - graph_data: Graph information array
     */
    const graphData = [];

    /**
     * - medicine_data:  Medication information array
     */
    const medicineData = [];

    //#endregion init variable

    //#region raw_data
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < resVitalData.vital_data.length; i++) {
      const vitalData = resVitalData.vital_data[i] as VitalInformationBlood; // Represent index foreach item.

      // From the information acquired from the "Vital Data Acquisition API", the information whose [deletion flag] is "1: deleted" is excluded.
      if (vitalData.delete === DeleteFlag.Yes) {
        continue;
      }
      /**
       * Array data of Measurement state
       */
      const measState = [];
      // When [Arrhythmia presence] is 1
      if (vitalData.ihb === IrregularHeartbeat.Yes) {
        measState.push(MeasurementState.Arrhythmia); // Update [Measurement Status] to 1
      }
      // When [Body movement] is 1
      if (vitalData.body_movement === BodyMovement.Yes) {
        measState.push(MeasurementState.BodyMovement); // If there is no 2 in [Daily measurement status], add 2 to
      }
      // When [Cuff winding state] has 0
      if (vitalData.cuff === Cuff.Abnormal) {
        measState.push(MeasurementState.Cuff); // If [Measurement status] is 0, update to 3
      }

      // Represent object for Blood Pressure Information
      // Fix for US_IDN-194 QA No.55
      const bloodPressureInfo = new BloodPressureInformation({
        date_time: (vitalData.input_type === VitalData.AutomaticInputType || vitalData.input_type === VitalData.ManualInputType) ?
          moment(moment(vitalData.date * 1000).utcOffset(vitalData.timezone)).format('YYYY-MM-DDTHH:mm:ssZ')
          : TimeUtil.format(vitalData.date * 1000, vitalData.timezone, false, false),
        input_type: vitalData.input_type,
        sys: vitalData.sys,
        dia: vitalData.dia,
        pulse: vitalData.pulse,
        meas_state: measState,
      });
      rawData.push(bloodPressureInfo);
    }

    //#endregion

    //#region Merging the measurement date

    const arrAggrerateDaily = aggregateDaily.map(d => d.measurement_date);
    const arrMeasAverageDataDates = resVitalAverageData.vital_data.map(v => TimeUtil.format(v.date.toString()));
    const arrSideEffectDates = !isNullOrUndefined(resSideEffectData)
      ? resSideEffectData.side_effect_info.map(s => TimeUtil.format(s.take_date.toString())) : [];
    const arrTakingMedicineDates = !isNullOrUndefined(resMedicineInfo)
      ? resMedicineInfo.take_date_info.map(m => TimeUtil.format(m.take_date.toString())) : [];
    /**
     * Merging the measurement date of the daily patient total information table and the measurement date acquired by OHI-API
     */
    const arrMeasDates: string[] = [...new Set(
      [].concat(arrAggrerateDaily, arrMeasAverageDataDates, arrSideEffectDates, arrTakingMedicineDates).sort((a, b) =>
        moment(b).unix() - moment(a).unix()))];
    //#endregion

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < arrMeasDates.length; i++) { // Loops item of measurement date
      const measDate = arrMeasDates[i]?.slice(0, 10);
      //#region daily_data

      // Filter data of Information On SideEffect have take_date  equal date
      const sideEffect = resSideEffectData?.side_effect_info?.find(s => {
        return (TimeUtil.format(s.take_date).slice(0, 10) === measDate && s.side_effects?.length > 0);
      });
      /**
       * Array data of side effect
       */
      const sideEffects = [];
      const types = sideEffect?.side_effects.split(',');
      if (types) {
        for (const type of types) {
          if (!isNullOrUndefined(type)) {
            sideEffects.push(+type);
          }
        }
      }

      /**
       * Measurement data
       */
      let measData;

      /**
       * Measurement state
       */
      let measState = 0;

      /**
       * Daily measurement status
       */
      const measDaily = [];

      /**
       * Irregular pulse wave count
       */
      let ihbCount = 0;

      /**
       * Morning measurement state
       */
      const measMorning = [];

      /**
       * Everning measurement state
       */
      const measEvening = [];

      /**
       * Date of vital_data equal measurement date
       */
      // Fix for US_IDN-194 QA No.55
      const measDatas = (resVitalData.vital_data as VitalInformationBlood[])?.filter(v => {
        // tslint:disable-next-line
        return moment(moment(v.date * 1000).utcOffset(v.timezone)).format('YYYY-MM-DD') === measDate;
      });
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < measDatas.length; j++) {
        measData = measDatas[j] as VitalInformationBlood;
        if (measData.delete === DeleteFlag.Yes) {
          continue;
        }

        // Convert measData.date with timezone to HH:mm
        // Fix for US_IDN-194 QA No.55
        const measHour = moment(moment(measData.date * 1000).utcOffset(measData.timezone)).format('HH:mm');
        // If [Measurement Date] (converted from [Measurement Date Time Zone] to Local Time) is from 00:00 to 12:00.
        if (measHour >= Constants.TIME_MORNING && measHour < Constants.TIME_AFTERNOON) {
          // When [Arrhythmia presence] is 1
          if (measData.ihb === IrregularHeartbeat.Yes) {
            if (measMorning.indexOf(MeasurementState.Arrhythmia) < 0) {
              measMorning.push(MeasurementState.Arrhythmia);
            }
            // If there is no 1 in [Daily measurement status], add 1 to [Daily measurement status].
            if (measDaily.indexOf(MeasurementState.Arrhythmia) < 0) {
              measDaily.push(MeasurementState.Arrhythmia);
            }
            // Increment [number of irregular pulse waves]
            ihbCount++;
            // Update [Measurement Status] to 1
            measState = MeasStateStatus.IrregularPulseWave;
          }
          // When [Body movement] is 1
          if (measData.body_movement === BodyMovement.Yes) {
            if (measMorning.indexOf(MeasurementState.BodyMovement) < 0) {
              // Check body movement equal 1
              measMorning.push(MeasurementState.BodyMovement);
            }
            // If there is no 2 in [Daily measurement status], add 2 to [Daily measurement status].
            if (measDaily.indexOf(MeasurementState.BodyMovement) < 0) {
              measDaily.push(MeasurementState.BodyMovement);
            }
            if (measState !== MeasStateStatus.IrregularPulseWave) {
              // Update [Measurement Status] to 2
              measState = MeasStateStatus.BodyMovement;
            }
          }
          // When [Cuff winding state] has 0
          if (measData.cuff === Cuff.Abnormal) {
            if (measMorning.indexOf(MeasurementState.Cuff) < 0) {
              measMorning.push(MeasurementState.Cuff);
            }
            // If there is no 3 in [Daily measurement state], add 3 to [Daily measurement state].
            if (measDaily.indexOf(MeasurementState.Cuff) < 0) {
              measDaily.push(MeasurementState.Cuff);
            }
            if (measState !== MeasStateStatus.IrregularPulseWave && measState !== MeasStateStatus.BodyMovement) {
              // Update [Measurement Status] to 2
              measState = MeasStateStatus.Cuff;
            }
          }
        } else {    // If [Measurement Date] (converted from [Measurement Date Time Zone] to Local Time) is from 12:00 to 24:00.
          // When [Arrhythmia presence] is 1
          if (measData.ihb === IrregularHeartbeat.Yes) {
            if (measEvening.indexOf(MeasurementState.Arrhythmia) < 0) {
              // Check ihb equal 1
              measEvening.push(MeasurementState.Arrhythmia);
            }
            // If there is no 1 in [Daily measurement status], add 1 to [Daily measurement status].
            if (measDaily.indexOf(MeasurementState.Arrhythmia) < 0) {
              measDaily.push(MeasurementState.Arrhythmia);
            }
            // Increment [number of irregular pulse waves]
            ihbCount++;
            // Update [Measurement Status] to 1
            measState = MeasStateStatus.IrregularPulseWave;
          }
          // When [Body movement] is 1
          if (measData.body_movement === BodyMovement.Yes) {
            if (measEvening.indexOf(MeasurementState.BodyMovement) < 0) {
              // Check body movement equal 1
              measEvening.push(MeasurementState.BodyMovement);
            }
            // If there is no 2 in [Daily measurement status], add 2 to [Daily measurement status].
            if (measDaily.indexOf(MeasurementState.BodyMovement) < 0) {
              measDaily.push(MeasurementState.BodyMovement);
            }
            if (measState !== MeasStateStatus.IrregularPulseWave) {
              // Update [Measurement Status] to 2
              measState = MeasStateStatus.BodyMovement;
            }
          }
          // When [Cuff winding state] has 0
          if (measData.cuff === Cuff.Abnormal) {
            if (measEvening.indexOf(MeasurementState.Cuff) < 0) {
              measEvening.push(MeasurementState.Cuff);
            }
            // If there is no 3 in [Daily measurement state], add 3 to [Daily measurement state].
            if (measDaily.indexOf(MeasurementState.Cuff) < 0) {
              measDaily.push(MeasurementState.Cuff);
            }
            if (measState !== MeasStateStatus.IrregularPulseWave && measState !== MeasStateStatus.BodyMovement) {
              // Update [Measurement Status] to 2
              measState = MeasStateStatus.Cuff;
            }
          }
        }
      }

      // measurement_date of aggregateDaily equal measurement date
      const dtDaily = aggregateDaily?.find(res => {
        return res.measurement_date.slice(0, 10) === measDate;
      });

      let rankTotal; //  If record could not be obtained, omit the item
      if (dtDaily) {
        rankTotal = dtDaily?.rank_total || 0;
      }

      // Represent index of vital_data
      const measVitalAverageData = resVitalAverageData.vital_data.find(v => TimeUtil.format(v.date.toString()).includes(measDate));

      /**
       * Systolic blood pressure average
       */
      let sysAvgDay;
      if (!isNullOrUndefined(measVitalAverageData?.sys_avg_day)) {
        // Omit this item if you cannot get the [Systolic blood pressure morning average].
        const numTmp = Number(measVitalAverageData?.sys_avg_day); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          sysAvgDay = numTmp;
        }
      }

      /**
       * Diastolic blood pressure average
       */
      let diaAvgDay;
      if (!isNullOrUndefined(measVitalAverageData?.dia_avg_day)) {
        // Omit this item if you cannot get the [Systolic blood pressure morning average].
        const numTmp = Number(measVitalAverageData?.dia_avg_day); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          diaAvgDay = numTmp;
        }
      }

      /**
       * Pulse blood pressure average
       */
      let pulseAvgDay;
      if (!isNullOrUndefined(measVitalAverageData?.pulse_avg_day)) {
        // Omit this item if you cannot get the [Systolic blood pressure morning average].
        const numTmp = Number(measVitalAverageData?.pulse_avg_day); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          pulseAvgDay = numTmp;
        }
      }
      // Represent Object of Average Information
      const averageInfo = new AverageInformation({
        date: measDate,
        rank_total: rankTotal,
        sys_avg_day: sysAvgDay,
        dia_avg_day: diaAvgDay,
        avg_pulse: pulseAvgDay,
        meas_state_day: measDaily,
        side_effects: sideEffects,
      });
      dailyData.push(averageInfo);

      //#endregion daily_data

      //#region graph_data
      // Represent object of Graph Information
      const graphInfo = new GraphInformation({});
      // "YYYY-MM-DD"Provide in the form of
      graphInfo.date = measDate;
      // Rank
      // Obtain [Auto Triage Rank] from “Daily Patient Total Information Table” using the measurement date as a key
      // Returns 0 when [Auto Triage Rank] is NULL or record could not be obtained
      graphInfo.rank_total = rankTotal;
      // Systolic blood pressure morning average
      // Get [Systolic blood pressure morning average] from "Vital average data acquisition API"
      if (!isNullOrUndefined(measVitalAverageData?.sys_avg_morning)) {
        // Omit this item if you cannot get the [Systolic blood pressure morning average].
        const numTmp = Number(measVitalAverageData?.sys_avg_morning); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          graphInfo.sys_avg_morning = numTmp;
        }
      }

      // Diastolic morning average
      // Obtain [Minimum Blood Pressure Morning Average] from "Vital Average Data Acquisition API"
      if (!isNullOrUndefined(measVitalAverageData?.dia_avg_morning)) {
        // If [Diastolic blood pressure morning average] cannot be obtained, omit the item.
        const numTmp = Number(measVitalAverageData?.dia_avg_morning); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          graphInfo.dia_avg_morning = numTmp;
        }
      }

      // Pulse morning average
      // Get [Pulse Morning Average] from “Vital Average Data Acquisition API”
      if (!isNullOrUndefined(measVitalAverageData?.pulse_avg_morning)) {
        // If [Pulse Morning Average] cannot be obtained, omit the item.
        const numTmp = Number(measVitalAverageData?.pulse_avg_morning); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          graphInfo.pulse_avg_morning = numTmp;
        }
      }

      // Systolic blood pressure night average
      // Obtain [systolic blood pressure night average] from "Vital average data acquisition API"
      if (!isNullOrUndefined(measVitalAverageData?.sys_avg_evening)) {
        // Omit this item if the [systolic blood pressure average] could not be obtained.
        const numTmp = Number(measVitalAverageData?.sys_avg_evening); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          graphInfo.sys_avg_evening = numTmp;
        }
      }

      // Minimum blood pressure night average
      // Obtain [minimum blood pressure night average] from "Vital average data acquisition API"
      if (!isNullOrUndefined(measVitalAverageData?.dia_avg_evening)) {
        // If [Minimum diastolic blood pressure average] cannot be obtained, omit the item.
        const numTmp = Number(measVitalAverageData?.dia_avg_evening); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          graphInfo.dia_avg_evening = numTmp;
        }
      }

      // Pulse night average
      // Get [Pulse Night Average] from “Vital Average Data Acquisition API”
      if (!isNullOrUndefined(measVitalAverageData?.pulse_avg_evening)) {
        // If [Pulse Night Average] could not be obtained, omit the item.
        const numTmp = Number(measVitalAverageData?.pulse_avg_evening); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          graphInfo.pulse_avg_evening = numTmp;
        }
      }

      // Examination room systolic blood pressure average
      // Obtain [Average Systolic Blood Pressure Average] from "Vital Average Data Acquisition API"
      if (!isNullOrUndefined(measVitalAverageData?.sys_avg_office)) {
        // If the [Average clinic's systolic blood pressure] could not be obtained, omit the item.
        const numTmp = Number(measVitalAverageData?.sys_avg_office); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          graphInfo.sys_avg_office = numTmp;
        }
      }

      // Examination room mean diastolic blood pressure
      // Obtain [Medical Room Minimum Blood Pressure] from "Vital Average Data Acquisition API"
      if (!isNullOrUndefined(measVitalAverageData?.dia_avg_office)) {
        // If [Medical room diastolic blood pressure average] cannot be obtained, omit the item.
        const numTmp = Number(measVitalAverageData?.dia_avg_office); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          graphInfo.dia_avg_office = numTmp;
        }
      }

      // Examination room pulse average
      // Obtain [Medical Room Pulse Average] from "Vital Average Data Acquisition API"
      if (!isNullOrUndefined(measVitalAverageData?.pulse_avg_office)) {
        // If [Medical Room Pulse Average] could not be obtained, omit the item.
        const numTmp = Number(measVitalAverageData?.pulse_avg_office); // Conver a string to type Number
        if (!isNaN(numTmp)) {
          // Check numTmp not a number
          graphInfo.pulse_avg_office = numTmp;
        }
      }
      // The priority order is [with irregular pulse wave]> [with body movement]> [cuff winding NG].

      graphInfo.meas_state = measState;
      graphInfo.ihb_count = ihbCount;
      graphInfo.meas_state_morning = measMorning;
      graphInfo.meas_state_evening = measEvening;
      graphInfo.side_effects = sideEffects;
      if (patientContract.contract_application === ContractApplication.Yes) {
        // If [Smartphone App Presence] is not set, omit the item.
        const lst = resMedicineInfo.take_date_info?.find(res => {
          // Find data of take_date_info have (take_date) equal (date)
          return (res.take_date.toString().slice(0, 10) === graphInfo.date.slice(0, 10));
        });
        if (!lst || !lst.take_rate) {
          // 0 if there is no [drug date] that matches [measurement date]
          graphInfo.take_rate = 0;
        } else {
          graphInfo.take_rate = lst.take_rate;
        }
      }

      graphData.push(graphInfo);

      //#endregion graph_data

    }

    //#region medicine_data
    // Represent medicine data
    const medicinesInformation: MedicinesInformation[] = resPrescriptionInfo.medicines as MedicinesInformation[];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < medicinesInformation.length; i++) { // Loops item of medicinesInformation
      const prescriptionData = medicinesInformation[i]; // Represent index of medicinesInformation
      const medicationInfo = new MedicationInformation({ // Represent object of MedicationInformation
        name: prescriptionData?.medicine_name,
        quantity: prescriptionData?.quantity.concat(prescriptionData?.units),
        dosing_start: !isNullOrUndefined(prescriptionData?.start) ?
          prescriptionData?.start?.toString().slice(0, 10) : undefined,
        dosing_end: !isNullOrUndefined(prescriptionData?.end) ?
          prescriptionData?.end?.toString().slice(0, 10) : undefined,
        ingestion_start: !isNullOrUndefined(prescriptionData?.taking_start) ?
          prescriptionData?.taking_start?.toString().slice(0, 10) : undefined,
        ingestion_end: !isNullOrUndefined(prescriptionData?.taking_end) ?
          prescriptionData?.taking_end?.toString().slice(0, 10) : undefined,
      });
      medicineData.push(medicationInfo);
    }
    //#endregion medicine_data

    /**
     * Represent object of Blood Pressure Detail
     */
    result = new BloodPressureDetail({
      result: new Result({ code: '0' }),
      contract_application: patientContract.contract_application,
      raw_data: rawData,
      daily_data: dailyData,
      graph_data: graphData.sort((a, b) => moment(a.date).unix() - moment(b.date).unix()),
      medicine_data: medicineData,
    });
    RpmLogger.info(req, result);
    return result;
  }

  /**
   * Sort vital data from OHI
   * @param a any
   * @param b any
   */
  sortInputType(a: any, b: any) {
    if (a.input_type === InputType.OfficeInput) {
      if (b.input_type === InputType.OfficeInput) {
        return b.created_at - a.created_at;
      }
      return -1;
    }
    if (b.input_type === InputType.OfficeInput) {
      return 1;
    }
    return b.date - a.date;
  }

  /**
   * (2) Input Check
   * @param query Request Blood Pressure Detail Service
   */
  private checkRequest(query: RequestBloodPressureDetailService): boolean | ProblemException {
    // Acquisition period start date
    if (isNullOrUndefined(query.date_from)) {
      // If not entered
      return new ProblemException({
        status: HttpStatus.BAD_REQUEST,
        code: CodeType.AtTheError,
        classificationCode: ClassificationCode.ValueUnsetting,
        excerptNo: BloodPressureDetailExcerptNo.StartDateIsNotInPut,
        messageType: MessageType.IsRequired,
        fields: MessageField.DateFrom,
      });
    }

    if (!Helper.isValidFormatDate(query.date_from)) {
      // If the format is not a date
      return new ProblemException({
        status: HttpStatus.BAD_REQUEST,
        code: CodeType.AtTheError,
        classificationCode: ClassificationCode.FormIllegal,
        excerptNo: BloodPressureDetailExcerptNo.StartDateIsNotADate,
        messageType: MessageType.InvalidFormat,
        fields: MessageField.DateFrom,
      });
    }

    if (!moment(query.date_from).isValid()) {
      // If a non-existent date is specified
      return new ProblemException({
        status: HttpStatus.BAD_REQUEST,
        code: CodeType.AtTheError,
        classificationCode: ClassificationCode.UnknownValue,
        excerptNo: BloodPressureDetailExcerptNo.StartDateDoNotExistIsSpecificed,
        messageType: MessageType.Invalid,
        fields: MessageField.DateFrom,
      });
    }

    // Acquisition period end date
    if (isNullOrUndefined(query.date_to)) {
      // If not entered.
      return new ProblemException({
        status: HttpStatus.BAD_REQUEST,
        code: CodeType.AtTheError,
        classificationCode: ClassificationCode.ValueUnsetting,
        excerptNo: BloodPressureDetailExcerptNo.EndDateIsNotInPut,
        messageType: MessageType.IsRequired,
        fields: MessageField.DateTo,
      });
    }

    if (!Helper.isValidFormatDate(query.date_to)) {
      // If the format is not a date.
      return new ProblemException({
        status: HttpStatus.BAD_REQUEST,
        code: CodeType.AtTheError,
        classificationCode: ClassificationCode.FormIllegal,
        excerptNo: BloodPressureDetailExcerptNo.EndDateIsNotADate,
        messageType: MessageType.InvalidFormat,
        fields: MessageField.DateTo,
      });
    }

    if (!moment(query.date_to).isValid()) {
      // If a non-existent date is specified.
      return new ProblemException({
        status: HttpStatus.BAD_REQUEST,
        code: CodeType.AtTheError,
        classificationCode: ClassificationCode.UnknownValue,
        excerptNo: BloodPressureDetailExcerptNo.EndDateDoNotExistIsSpecificed,
        messageType: MessageType.Invalid,
        fields: MessageField.DateTo,
      });
    }

    if (query.date_to < query.date_from) {
      // When a value earlier than the acquisition period start date is specified on the acquisition period end date.
      return new ProblemException({
        status: HttpStatus.BAD_REQUEST,
        code: CodeType.AtTheError,
        classificationCode: ClassificationCode.RangeIsIllegal,
        excerptNo: BloodPressureDetailExcerptNo.EndDateEarlierThanStartDate,
        messageType: MessageType.MustBeNewerThan,
        fields: [MessageField.DateTo, MessageField.DateFrom],
      });
    }
    return true;
  }

  //#region (3) Patient information acquisition

  /**
   * Get Vital Data
   * @param query
   * OHI vital data acquisition API call
   */
  async getVitalData(query: RequestBloodPressureDetailService) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const requestVitalData = new RequestGetVitalData({
          ha_user_id: query.ha_user_id,
          type: VitalData.BloodPressureType,
          input_type: VitalData.AllInputType,
          date_type: VitalData.MeasurementDateType,
          start: query.date_from + Constants.TIME_START_DATE,
          end: query.date_to + Constants.TIME_END_DATE,
        });
        const vitalData = await this.ohiService.getVitalData(requestVitalData, OHIEntryName.ApiGetVitalData);
        if (!(vitalData instanceof Problem)) {
          // If vitalData is not Problem.
          resolve(vitalData);
        } else {
          // Reject ProblemException
          reject(new ProblemException());
        }
      }, 0);
    });
  }

  /**
   * Get Side Effect Information
   * @param query RequestBloodPressureDetailService
   * @param contractApplication Number smartphone application presence
   * OHI Side effect information acquisition API call
   */
  async getSideEffectInfo(query: RequestBloodPressureDetailService, contractApplication: number) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (contractApplication === ContractApplication.Yes) { // Check contractApplication exists.
          // Represent object of RequestSideEffectInfo
          const requestSideEffectInfo = new RequestSideEffectInfo({
            ha_user_id: query.ha_user_id,
            start: query.date_from + Constants.TIME_START_DATE,
            end: query.date_to + Constants.TIME_END_DATE,
          });
          // Get data from ohi api (getSideEffectInfo)
          const res = await this.ohiService.getSideEffectInfo(requestSideEffectInfo, OHIEntryName.ApiGetSideEffectInfo);
          if (!(res instanceof Problem)) {
            resolve(res);
          } else {
            reject(new ProblemException());
          }
        } else {
          resolve(null);
        }
      }, 0);
    });
  }

  /**
   * Get Taking Medicine Information
   * @param query RequestBloodPressureDetailService
   * @param contractApplication number
   */
  async getTakingMedicineInfo(query: RequestBloodPressureDetailService, contractApplication: number) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (contractApplication === ContractApplication.Yes) { // Check contractApplication exists.
          // Represent object of RequestGetTakingMedicineInfo
          const requestTakingMedicineInfo = new RequestGetTakingMedicineInfo({
            ha_user_id: query.ha_user_id,
            start: query.date_from + Constants.TIME_START_DATE,
            end: query.date_to + Constants.TIME_END_DATE,
          });
          // Get Taking Medicine Information from OHI.
          const takingMedicineInfo = await this.ohiService.getTakingMedicineInfo(requestTakingMedicineInfo, OHIEntryName.ApiGetTakingMedicineInfo);
          if (!(takingMedicineInfo instanceof Problem)) {
            resolve(takingMedicineInfo);
          } else {
            reject(new ProblemException());
          }
        } else {
          resolve(null);
        }
      }, 0);
    });
  }

  /**
   * Get Vital Average Data
   * @param query RequestBloodPressureDetailService
   */
  async getVitalAverageData(query: RequestBloodPressureDetailService) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // Represent object of RequestGetVitalAverageData
        const requestVitalAverageInfo = new RequestGetVitalAverageData({
          ha_user_id: query.ha_user_id,
          start: query.date_from + Constants.TIME_START_DATE,
          end: query.date_to + Constants.TIME_END_DATE,
        });
        // Get Vital Average Data from OHI.
        const res = await this.ohiService.getVitalAverageData(requestVitalAverageInfo, OHIEntryName.ApiGetVitalAverageData);
        if (!(res instanceof Problem)) {
          resolve(res);
        } else {
          reject(new ProblemException());
        }
      }, 0);
    });
  }

  /**
   * Get Prescription Info
   * @param query RequestBloodPressureDetailService
   */
  async getPrescriptionInfo(query: RequestBloodPressureDetailService) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // Represent object of Request Prescription Information
        const requestPrescriptionInfo = new RequestPrescriptionInfo({
          ha_user_id: query.ha_user_id,
          start: query.date_from + Constants.TIME_START_DATE,
          end: query.date_to + Constants.TIME_END_DATE,
        });
        // Get data get Prescription Information from OHI
        const prescriptionInfo = await this.ohiService.getPrescriptionInfo(requestPrescriptionInfo, OHIEntryName.ApiGetPrescriptionInfo);
        if (!(prescriptionInfo instanceof Problem)) {
          resolve(prescriptionInfo);
        } else {
          reject(new ProblemException());
        }
      }, 0);
    });
  }

  //#endregion
}
