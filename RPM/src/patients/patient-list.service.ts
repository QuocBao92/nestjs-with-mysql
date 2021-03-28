/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import * as Enums from '../common/enums';
import { BloodPressure } from './model/response-model/get-patient-list/blood-pressure';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNullOrUndefined } from 'util';
import { OhiService } from '../ohi/ohi.service';
import { PatientAggregate } from './entity/patient-aggregate.entity';
import { PatientContract } from './entity/patient-contract.entity';
import { PatientInformation } from './model/response-model/get-patient-list/patient-information';
import { Problem } from '../common/problem';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { RequestGetPersonalInfo, RequestWeightInfo } from '../ohi/models/request-model';
import { RequestPatientListService, WeightData } from './model/patient-model';
import { Result } from '../models';
import * as Constants from './../common/constants';
import {
    ClassificationCode,
    CodeType,
    MessageType,
    PatientListExcerptNo,
    ProblemException,
    MessageField,
    PageType,
    DeleteFlag,
    ContractApplication,
    OHIEntryName,
    RpmLogger,
    ContractWeight,
    WeightAlert,
} from '../common';
import moment = require('moment');
import { RequestPatientList } from './model/request-model/request-patient-list';
import { GetPersonalInfoModel, GetWeightInfo } from '../ohi/models/response-model';
import TimeUtil from '../common/time-util';
import { PatientList } from './model/response-model';

@Injectable()
export class PatientListService {

    /**
     * Constructor of Patient List Service
     * @param ohiService OhiService
     * @param patientAggregateRepository Repository<Patient>
     * @param PatientContractRepository Repository<PatientContract>
     */
    constructor(
        private readonly ohiService: OhiService,
        @InjectRepository(PatientAggregate)
        private patientAggregateRepository: Repository<PatientAggregate>,
        @InjectRepository(PatientContract)
        private PatientContractRepository: Repository<PatientContract>,
    ) { }

    /**
     * Get List Patient
     * @param req Request
     * @param param RequestPatientListService
     */
    async getPatientList(req: Request, body: RequestPatientList): Promise<PatientList | Problem> {
        // Get HA-ID list from session data
        const param = new RequestPatientListService({
            type: body.type,
            page_type: req.query.page_type,
            ha_user_ids: req.query.ha_user_ids,
        });
        let result;
        if (isNullOrUndefined(param.ha_user_ids) || param.ha_user_ids.length === 0 || !Array.isArray(param.ha_user_ids)) {
            // If the HA - ID list is not included in the session data, return an empty array
            result = new PatientList({
                result: {
                    code: '0',
                },
                data_type: body.type || req.query.page_type || PageType.BloodPressure,
                patient_data: [],
            });
            RpmLogger.info(req, result);
            return result;
        }

        // (2)Input check. Return an error response if have problem
        result = this.inputCheck(param);
        if (result instanceof ProblemException) {
            RpmLogger.error(req, result);
            return result;
        }

        // (3) Obtain patient information
        // From the patient total information table, get information that "HeartAdvisorUserID"
        // matches the HA-ID list obtained from the session data
        let patientAggregates: PatientAggregate[];
        // Check ha_user_id is array
        const listHAID = param.ha_user_ids?.map(h => {
            return { ha_user_id: h };
        });
        try {
            patientAggregates = await this.patientAggregateRepository.find({ where: listHAID });
        } catch {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }
        //  From the patient contract information table, get information that
        //  "HeartAdvisorUserID" matches the HA-ID list obtained from the session data
        //  array ha_user_id condition in table PatientContract.
        const haids = param.ha_user_ids?.map(h => {
            return {
                ha_user_id: h,
                delete_flag: DeleteFlag.No,
            };
        });
        // Corresponding information to HA-ID that "HeartAdvisorUserID"
        // acquired in (3) is acquired from the patient contract information table.
        let patientContracts: PatientContract[];
        try {
            // Find patient contract by haids (ha_user_id, delete_flag = 0 );
            patientContracts = await this.PatientContractRepository.find({
                where: haids,
            });
        } catch {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }

        const personalInfo: GetPersonalInfoModel = await this.getPersonalInfo(param);
        if (isNullOrUndefined(personalInfo) || personalInfo instanceof Problem) {
            // Check response status.
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }

        const weightInfo: GetWeightInfo = await this.getWeightInfo(param);
        if (isNullOrUndefined(weightInfo) || weightInfo instanceof Problem) {
            // Check response status.
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }

        // 4) Determine the screen to be displayed
        // Check POST body
        if (param.type === PageType.BloodPressure) {
            // If "screen type" is specified, provide information according to the information of the specified screen
            return await this.getBloodPressure(req, patientAggregates, patientContracts, personalInfo, weightInfo);
        } else if (param.type === PageType.Weight) {
            // Patient list (weight)
            return await this.getPatientWeight(req, param, patientAggregates, patientContracts, personalInfo, weightInfo);
            // Check session data
        } else if (param.page_type === PageType.BloodPressure) {
            // When "Page type" is "1: Blood pressure"
            return await this.getBloodPressure(req, patientAggregates, patientContracts, personalInfo, weightInfo);
        } else if (param.page_type === PageType.Weight) {
            // When "Page type" is "2: Weight"
            return await this.getPatientWeight(req, param, patientAggregates, patientContracts, personalInfo, weightInfo);
        }
        // If "screen type" is not specified, determine the information to be provided based on the
        // information obtained from the patient summary information table in the following order
        if (patientAggregates.find(p => p.rank_total === Constants.RANK_TOTAL_ALERT)) {
            // 1. There is a record with an auto triage rank of "4" (H)→ (5) Create and return patient list (blood pressure).
            return await this.getBloodPressure(req, patientAggregates, patientContracts, personalInfo, weightInfo);
        } else if (weightInfo.data.find(w => w.weight_alert !== 0)) {
            // 2. There is a record with a weight threshold excess alert of "1 or more" (with alert) and  return patient list (weight)
            return await this.getPatientWeight(req, param, patientAggregates, patientContracts, personalInfo, weightInfo);
        } else {
            // Does not meet the above conditions
            return await this.getBloodPressure(req, patientAggregates, patientContracts, personalInfo, weightInfo);
        }
    }

    // (2)Input check
    /**
     * Check Input
     * @param param RequestPatientListService
     */
    private inputCheck(param: RequestPatientListService): true | ProblemException {
        if (param.type !== undefined) {
            // If "screen type" is specified
            if (typeof param.type !== 'number') {
                // If the format is not an integer return it problem
                return new ProblemException({
                    status: HttpStatus.BAD_REQUEST,
                    code: CodeType.AtTheError,
                    classificationCode: ClassificationCode.FormIllegal,
                    excerptNo: PatientListExcerptNo.TypeIsNotInteger,
                    messageType: MessageType.MustBeANumber,
                    fields: MessageField.Type,
                });
            }
            if (param.type !== Enums.PageType.BloodPressure && param.type !== Enums.PageType.Weight) {
                // When a value other than 1 and 2 is specified return it problem.
                return new ProblemException({
                    status: HttpStatus.BAD_REQUEST,
                    code: CodeType.AtTheError,
                    classificationCode: ClassificationCode.RangeIsIllegal,
                    excerptNo: PatientListExcerptNo.TypeoOther1Or2,
                    messageType: MessageType.Invalid,
                    fields: MessageField.Type,
                });
            }
        }
        // If "screen type" is not specified return it true
        return true;
    }

    /**
     * Get personal info from OHI
     * @param param RequestPatientListService
     */
    private async getPersonalInfo(param: RequestPatientListService): Promise<any> {
        // This API gets patient information.
        const requestPersonalInfo = new RequestGetPersonalInfo({ ha_user_id: param.ha_user_ids });
        const personalInfo = await this.ohiService.getPersonalInfo(requestPersonalInfo, OHIEntryName.ApiGetPersonalInfo);
        return personalInfo;
    }

    /**
     * getWeightInfo
     * @param param RequestPatientListService
     */
    private async getWeightInfo(param: RequestPatientListService): Promise<any> {
        // This API gets weight information
        const requestWeightInfo = new RequestWeightInfo({ ha_user_id: param.ha_user_ids });
        // call api OHI from patient list api RPM
        const latestWeightInfo = await this.ohiService.getWeightInfo(requestWeightInfo, OHIEntryName.ApiGetWeightInfo);
        return latestWeightInfo;
    }

    /**
     * Get Blood Pressure
     * @param req Request
     * @param patientAggregates PatientAggregate[]
     * @param patientContracts PatientContract[]
     * @param personalInfo GetPersonalInfoModel
     * @param weightInfos GetWeightInfo
     */
    public async getBloodPressure(
        req: Request, patientAggregates: PatientAggregate[], patientContracts: PatientContract[],
        personalInfo: GetPersonalInfoModel, weightInfos: GetWeightInfo) {
        // tslint:disable-next-line:variable-name
        const patient_data = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < patientAggregates.length; i++) {
            const haid = patientAggregates[i].ha_user_id;
            // Find patientContract by ha_user_id  from patientContracts
            const patientContract = patientContracts.find(c => c.ha_user_id === haid);

            if (!patientContract) {
                // If patientContract not exits then omit the item.
                continue;
            }
            // Find personalInfoItem by ha_user_id from personalInfo
            const personalInfoItem = personalInfo.data.find(p => p.ha_user_id === haid);

            // Find vitalData by ha_user_id from ohi api personalInfo
            const vitalData = patientAggregates.find(v => v.ha_user_id === haid);

            const weightInfo = weightInfos.data.find(w => w.ha_user_id === haid);

            // The variable contains Side effect incidence
            let sideEffectRate;
            if (patientContract.contract_application === ContractApplication.No) {
                // If [Smartphone application presence] in the patient contract information is 0 (no smartphone application), omit the item.
                sideEffectRate = undefined;
            } else if (patientContract.contract_application === ContractApplication.Yes) {
                // If [Smartphone application presence] in the patient contract information is 1,
                // get sideEffectRate from the "Patient total information table"
                sideEffectRate = !isNullOrUndefined(vitalData?.side_effect_rate) ? vitalData?.side_effect_rate : 0;
            }

            let noticeItem;
            if (vitalData?.algo_alert === 0) {
                noticeItem = 0;
            } else {
                noticeItem = 1;
            }

            // Blood pressure information
            const bloodPressure = new BloodPressure({
                last_update: vitalData?.last_meas_date ? moment(vitalData?.last_meas_date).format('YYYY-MM-DD') : undefined,
                day_sys_latest: !isNullOrUndefined(vitalData?.day_sys_latest) ? vitalData?.day_sys_latest : undefined,
                day_dia_latest: !isNullOrUndefined(vitalData?.day_dia_latest) ? vitalData?.day_dia_latest : undefined,
                sys_target: !isNullOrUndefined(vitalData?.target_sys) ? vitalData?.target_sys : undefined,
                dia_target: !isNullOrUndefined(vitalData?.target_dia) ? vitalData?.target_dia : undefined,
                sys_threshold: !isNullOrUndefined(vitalData?.threshold_sys) ? vitalData?.threshold_sys : undefined,
                dia_threshold: !isNullOrUndefined(vitalData?.threshold_dia) ? vitalData?.threshold_dia : undefined,
                day_pulse_latest: !isNullOrUndefined(vitalData?.day_pulse_latest) ? vitalData?.day_pulse_latest : undefined,
                threshold_excess_num: !isNullOrUndefined(vitalData?.threshold_excess_num) ? vitalData?.threshold_excess_num : undefined,
                meas_num: !isNullOrUndefined(vitalData?.meas_num) ? vitalData?.meas_num : undefined,
                ihb_rate: !isNullOrUndefined(vitalData?.ihb_rate) ? vitalData?.ihb_rate : undefined,
                side_effect_rate: sideEffectRate,
                rank_sys: vitalData?.rank_sys ? vitalData?.rank_sys : 0,
                rank_dia: vitalData?.rank_dia ? vitalData?.rank_dia : 0,
                rank_pulse: vitalData?.rank_pulse ? vitalData?.rank_pulse : 0,
                rank_excess_rate: vitalData?.rank_excess_rate ? vitalData?.rank_excess_rate : 0,
                rank_ihb_rate: vitalData?.rank_ihb_rate ? vitalData?.rank_ihb_rate : 0,
                rank_side_effect_rate: vitalData?.rank_side_effect_rate ? vitalData?.rank_side_effect_rate : 0,
                rank_notice: 0,
                point_sys: vitalData?.point_sys ? +vitalData?.point_sys : 0,
                point_dia: vitalData?.point_dia ? +vitalData?.point_dia : 0,
                point_pulse: vitalData?.point_pulse ? +vitalData?.point_pulse : 0,
                point_excess_rate: vitalData?.point_excess_rate ? +vitalData?.point_excess_rate : 0,
                point_ihb_rate: vitalData?.point_ihb_rate ? +vitalData?.point_ihb_rate : 0,
                point_side_effect_rate: vitalData?.point_side_effect_rate ? +vitalData?.point_side_effect_rate : 0,
                notice: noticeItem,
            });
            // Patient information array
            const patientInformation = new PatientInformation({
                ha_user_id: haid,
                rank_total: vitalData?.rank_total ? vitalData?.rank_total : 0,
                weight_alert: patientContract.contract_weight === ContractWeight.No ? 0 : weightInfo?.weight_alert === WeightAlert.None ? 0 : 1,
                mr_id: personalInfoItem.mr_id,
                first_name: personalInfoItem.first_name,
                middle_name: personalInfoItem?.middle_name,
                last_name: personalInfoItem.last_name,
                gender: personalInfoItem.gender,
                age: personalInfoItem.age,
                pressure: bloodPressure,
            });
            patient_data.push(patientInformation);
        }
        // Sort key Item Direction
        // 1.Auto triage rank: Descending.
        // 2.Systolic blood pressure average for the last day: Descending.
        // 3.Minimum blood pressure recent day average: Descending.
        // 4.Patient ID: : Descending.
        patient_data.sort((a, b) => (
            b.rank_total - a.rank_total ||
            this.sortArr(b.pressure.day_sys_latest, a.pressure.day_sys_latest) ||
            this.sortArr(b.pressure.day_dia_latest, a.pressure.day_dia_latest) ||
            b.mr_id.localeCompare(a.mr_id)));
        // With current requirements,"Screen type" is not returned in 2: Weight list.
        const result = new PatientList({
            result: new Result({ code: '0' }),
            data_type: Enums.PageType.BloodPressure,
            patient_data,
        });
        RpmLogger.info(req, result);
        return result;
    }

    /**
     * Sort array in case undefined
     * @param a number or undefined
     * @param b number or undefined
     */
    public sortArr(a: number | undefined, b: number | undefined) {
        if (a === undefined && b === undefined) { return 0; }
        if (a === undefined) { return -1; }
        if (b === undefined) { return 1; }
        if (a === b) { return 0; }
        return a < b ? -1 : 1;
    }

    /**
     * Get patient weight information
     * @param req Request
     * @param param RequestPatientListService
     * @param patientAggregates PatientAggregate[]
     * @param patientContracts PatientContract[]
     * @param personalInfo GetPersonalInfoModel
     * @param weightInfos GetWeightInfo
     */
    public async getPatientWeight(
        req: Request, param: RequestPatientListService, patientAggregates: PatientAggregate[], patientContracts: PatientContract[],
        personalInfo: GetPersonalInfoModel, weightInfos: GetWeightInfo) {
        // tslint:disable-next-line:variable-name
        const patient_data = [];

        // Screen type = 2: Weight
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < param.ha_user_ids.length; i++) {
            const haid = param.ha_user_ids[i];
            // Find patientContract by ha_user_id from patientContracts
            const patientContract = patientContracts.find(c => c.ha_user_id === haid);
            if (patientContract === undefined || patientContract?.contract_weight === 0) {
                // No body weight composition meter contract (contract weight = 0).
                // omit the item
                continue;
            }
            // Find vitalData by ha_user_id from patientAggregates
            const vitalData = patientAggregates.find(v => v.ha_user_id === haid);
            // Find personalInfoItem by ha_user_id from personalInfo
            const personalInfoItem = personalInfo.data.find(p => p.ha_user_id === haid);
            // Find weightInfo by ha_user_id from weightInfos
            const weightInfo = weightInfos.data.find(w => w.ha_user_id === haid);

            let weightData: WeightData;
            /**
             * Weight Threshold Exceeded Alert: Threshold setting (kg)
             */
            let thresholdKg;
            /**
             * Weight Threshold Exceeded Alert: Threshold setting (lbs)
             */
            let thresholdLbs;
            /**
             * Weight Threshold Exceeded Alert: Threshold setting: Duration
             */
            let thresholdPeriod;
            let sortKeyByThresholdLbs = 0;
            if (!isNullOrUndefined(weightInfo?.threshold_kg) &&
                !isNullOrUndefined(weightInfo?.threshold_lbs) &&
                !isNullOrUndefined(weightInfo?.threshold_period)) {
                thresholdKg = +weightInfo.threshold_kg;
                thresholdLbs = +weightInfo.threshold_lbs;
                thresholdPeriod = +weightInfo.threshold_period;
                sortKeyByThresholdLbs = +weightInfo.after_weight_lbs - +weightInfo.before_weight_lbs - +weightInfo.threshold_lbs;
            }

            /* When "Weight threshold excess alert existence"
             * is 1
             * (It is a weight threshold of priority "Low" and there is an alert)
             * or 2
             * (It is a weight threshold of priority "High" and there is an alert), it processes it as follows.
             */
            if (weightInfo.weight_alert !== 0) {
                weightData = {
                    last_update: !isNullOrUndefined(weightInfo?.last_weight_meas_date) ?
                        moment(weightInfo?.last_weight_meas_date).format('YYYY-MM-DD') : undefined,
                    before_weight_kg: !isNullOrUndefined(weightInfo?.before_weight_kg) ? +weightInfo?.before_weight_kg : undefined,
                    before_weight_lbs: !isNullOrUndefined(weightInfo?.before_weight_lbs) ? +weightInfo?.before_weight_lbs : undefined,
                    before_day: !isNullOrUndefined(weightInfo?.before_date) && !isNullOrUndefined(weightInfo?.before_timezone) ?
                        TimeUtil.format(weightInfo.before_date * 1000, weightInfo.before_timezone, false, false) : undefined,
                    after_weight_kg: !isNullOrUndefined(weightInfo?.after_weight_kg) ? +weightInfo?.after_weight_kg : undefined,
                    after_weight_lbs: !isNullOrUndefined(weightInfo?.after_weight_lbs) ? +weightInfo?.after_weight_lbs : undefined,
                    after_day: !isNullOrUndefined(weightInfo?.after_date) && !isNullOrUndefined(weightInfo?.after_timezone) ?
                        TimeUtil.format(weightInfo.after_date * 1000, weightInfo.after_timezone, false, false) : undefined,
                    threshold_kg: thresholdKg,
                    threshold_lbs: thresholdLbs,
                    threshold_period: thresholdPeriod,
                    sort_second_key_lbs: sortKeyByThresholdLbs,
                };
            } else {
                // When "Weight threshold excess alert existence" is 0(none), it processes it as follows.
                weightData = {
                    last_update: !isNullOrUndefined(weightInfo?.last_weight_meas_date) ?
                        moment(weightInfo?.last_weight_meas_date).format('YYYY-MM-DD') : undefined,
                    after_weight_kg: !isNullOrUndefined(weightInfo?.latest_weight_kg) ? +weightInfo?.latest_weight_kg : undefined,
                    after_weight_lbs: !isNullOrUndefined(weightInfo?.latest_weight_lbs) ? +weightInfo?.latest_weight_lbs : undefined,
                    after_day: !isNullOrUndefined(weightInfo?.latest_date) && !isNullOrUndefined(weightInfo?.latest_timezone) ?
                        TimeUtil.format(weightInfo.latest_date * 1000, weightInfo.latest_timezone, false, false) : undefined,
                    threshold_kg: thresholdKg,
                    threshold_lbs: thresholdLbs,
                    threshold_period: thresholdPeriod,
                    sort_second_key_lbs: 0,
                };
            }

            // Patient information array.
            const patientWeight = new PatientInformation({
                ha_user_id: haid,
                rank_total: vitalData.rank_total ? vitalData.rank_total : 0,
                weight_alert: weightInfo?.weight_alert,
                mr_id: personalInfoItem.mr_id,
                first_name: personalInfoItem.first_name,
                middle_name: personalInfoItem?.middle_name,
                last_name: personalInfoItem.last_name,
                gender: personalInfoItem.gender,
                age: personalInfoItem.age,
                weight: weightData,
            });
            // Push element each patientWeight patient_data array.
            patient_data.push(patientWeight);
        }
        // Sort key Item Direction :
        // 1.weight alert descending order
        // 2.Weight list Second sort key
        // 3.Patient age descending order
        // 4.Patient ID descending order.
        patient_data.sort((a, b) => (
            b.weight_alert - a.weight_alert ||
            b.weight.sort_second_key_lbs - a.weight.sort_second_key_lbs ||
            b.age - a.age ||
            b.mr_id.localeCompare(a.mr_id)
        )).map(p => {
            p.weight_alert = (p?.weight_alert === 0) ? 0 : 1;
            delete p.weight.sort_second_key_lbs;
            return p;
        });
        const result = new PatientList({
            result: new Result({ code: '0' }),
            data_type: Enums.PageType.Weight,
            patient_data,
        });
        RpmLogger.info(req, result);
        return result;
    }
}
