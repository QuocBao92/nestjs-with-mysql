/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { isNullOrUndefined } from 'util';
import {
    ClassificationCode, CodeType, Keys, MessageField, MessageType, OHIEntryName, Problem, ProblemException,
    RpmLogger, SetWeightThresholdExcerptNo, ThresholdEnabledFlag, ThresholdSettingId, ThresholdUnit,
} from '../common';
import { Result } from '../models';
import { RequestGetWeightThreshold, RequestSetWeightThresholdOHI } from '../ohi/models/request-model';
import { OhiService } from '../ohi/ohi.service';
import { SettingService } from '../setting/setting.service';
import { SetWeightThresholdModel } from './model/patient-model';
import { RequestSetWeightThreshold } from './model/request-model/request-set-weight-threshold';
import { GetWeightThreshold, SetWeightThreshold } from './model/response-model';

/**
 * Setting
 */
export interface Setting {
    weightThresholdMax: number;
    weightThresholdMin: number;
    weightPeriodMax: number;
    weightPeriodMin: number;
}

@Injectable()
export class PatientWeightThresholdService {
    /**
     * Constructor of Patient Weight Threshold Service
     * @param settingService SettingService
     * @param ohiService OhiService
     */
    constructor(
        private readonly settingService: SettingService,
        private readonly ohiService: OhiService,
    ) { }

    // Array contains the setting variables
    settingKeys = [Keys.weight_threshold_max, Keys.weight_threshold_min, Keys.weight_period_max, Keys.weight_period_min];

    /**
     * Weight threshold acquisition API
     * @param req Request
     */
    async getWeightThreshold(req: Request): Promise<GetWeightThreshold | ProblemException> {
        let result;
        if (isNullOrUndefined(req.query.current_ha_user_id)) {
            result = new ProblemException({
                status: HttpStatus.NOT_FOUND,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.IsNotFound,
                messageType: MessageType.IsNotFound,
            });
            RpmLogger.warn(req, result);
            return result;
        }

        // (2) Weight threshold acquisition
        // Call Weight threshold acquisition API to get the weight threshold
        const weightThresholds = await this.getWeightThresholdFromOHI(req);
        if (!weightThresholds || weightThresholds.length === 0 || weightThresholds instanceof Problem) {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }
        const haid = req.query.current_ha_user_id;
        // Find weight threshold by haid
        const weightThreshold = weightThresholds?.find(w => w.ha_user_id === haid);
        if (!weightThreshold) {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }
        // Get data from the setting information master table
        const setting = await this.getThresholdLimit(req, this.settingKeys);
        if (setting instanceof ProblemException) {
            RpmLogger.fatal(req, setting);
            return setting;
        }

        /**
         * Array data of threshold
         */
        let thresholdData = [];

        /**
         * Array data of Initial Threshold
         */
        let initData = [];

        // Get Threshold from OHI
        thresholdData = weightThreshold.threshold?.map(w => ({
            id: w.id,
            enabled_flag: w.enabled_flag,
            threshold_kg: w.threshold_kg ? +w.threshold_kg : undefined,
            threshold_lbs: w.threshold_lbs ? +w.threshold_lbs : undefined,
            period: w.period ? w.period : undefined,
        })) || [];

        // Get Initial setting from OHI
        initData = weightThreshold.init.map(w => ({
            id: w.id,
            enabled_flag: w.enabled_flag,
            threshold_kg: +w.threshold_kg,
            threshold_lbs: +w.threshold_lbs,
            period: w.period,
        }));

        // (3) Create and return response data
        result = new GetWeightThreshold({
            result: { code: '0' },
            threshold: thresholdData,
            init: initData,
            threshold_max: setting.weightThresholdMax,
            threshold_min: setting.weightThresholdMin,
            period_max: setting.weightPeriodMax,
            period_min: setting.weightPeriodMin,
        });
        RpmLogger.info(req, result);
        return result;
    }

    /**
     * Get weight threshold from OHI
     * @param req Request
     */
    private async getWeightThresholdFromOHI(req: Request): Promise<any> {
        // This API gets patient information.
        const param = new RequestGetWeightThreshold({
            ha_user_id: [req.query.current_ha_user_id],
        });
        const weightThreshold = await this.ohiService.getWeightThreshold(param, OHIEntryName.ApiGetWeightThreshold);
        if (weightThreshold instanceof Problem) {
            return weightThreshold;
        }
        return weightThreshold?.threshold_info;
    }

    /**
     * Weight threshold registration API
     * @param req Request
     * @param body RequestSetWeightThreshold
     */
    async setWeightThreshold(req: Request, body: RequestSetWeightThreshold): Promise<Result | ProblemException> {
        const param = new SetWeightThresholdModel({
            ha_user_id: req.query.current_ha_user_id,
            threshold: body.threshold,
        });
        let result: any;
        // (1) Perform access token authentication
        if (isNullOrUndefined(param.ha_user_id)) {
            // If the HA - ID list is not included in the session data, return an error response(No applicable information: 404 NOT FOUND)
            // Initialize object problem responses status.
            result = new ProblemException({
                status: HttpStatus.NOT_FOUND,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.IsNotFound,
                messageType: MessageType.IsNotFound,
            });
            RpmLogger.warn(req, result);
            return result;
        }

        // (2) Input check
        // Get the upper limit and lower limit of weight threshold setting and weight period setting from the setting information master table
        // The array containing setting value get from table m_setting_info
        const setting = await this.getThresholdLimit(req, this.settingKeys);
        if (setting instanceof ProblemException) {
            RpmLogger.fatal(req, setting);
            return setting;
        }

        result = this.inputCheckSetWeightThreshold(
            param, setting.weightThresholdMax, setting.weightThresholdMin, setting.weightPeriodMax, setting.weightPeriodMin,
        );
        if (result instanceof ProblemException) {
            RpmLogger.error(req, result);
            return result;
        }

        // (3) Weight threshold registration
        // The array containing converted result of threshold information get from OHI
        const thresholds = param.threshold.map(threshold => {
            // Loop through the array containing raw data from OHI, convert value into string format then push into the 'threshold' array
            return {
                id: threshold.id,
                enabled_flag: threshold.enabled_flag,
                value: threshold.value.toString(),
                unit: threshold.unit,
                period: threshold.period,
            };
        });

        // The object containing request parameters to send to OHI
        const paramSetWeightThreshold = new RequestSetWeightThresholdOHI({
            ha_user_id: param.ha_user_id,
            threshold: thresholds,
        });

        const response = await this.ohiService.setWeightThreshold(paramSetWeightThreshold, OHIEntryName.ApiSetWeightThreshold);
        if (response instanceof Problem) {
            const err = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, err);
            return err;
        }

        // (4) Create and return response data
        result = new SetWeightThreshold({
            result: new Result({ code: '0' }),
        });
        RpmLogger.info(req, { result });
        return result;
    }

    /**
     * Input check data Set Weight Threshold
     * @param param SetWeightThresholdModel
     * @param thresholdMax weight_threshold_max
     * @param thresholdMin weight_threshold_min
     * @param periodMax weight_period_max
     * @param periodMin weight_period_min
     */
    private inputCheckSetWeightThreshold(
        param: SetWeightThresholdModel, thresholdMax: number, thresholdMin: number, periodMax: number, periodMin: number,
    ): true | ProblemException {
        if (isNullOrUndefined(param.threshold)) {
            // If threshold is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetWeightThresholdExcerptNo.ThresholdIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.Threshold,
            });
        }

        if (!Array.isArray(param.threshold)) {
            // If threshold not in the form of an object array
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetWeightThresholdExcerptNo.ThresholdIsNotObjectArray,
                messageType: MessageType.MustBeObjectArray,
                fields: MessageField.Threshold,
            });
        }

        if (param.threshold.length !== 2) {
            // If the length of threshold is not 2
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.NumberOfExcess,
                excerptNo: SetWeightThresholdExcerptNo.ThresholdExceedsTheRange,
                messageType: MessageType.CasesExceedsTheRange,
                fields: MessageField.Threshold,
            });
        }

        // Object containing input of setting alert threshold number 1
        const alert1 = param.threshold[0];
        // Object containing input of setting alert threshold number 2
        const alert2 = param.threshold[1];

        if (isNullOrUndefined(alert1.id) || isNullOrUndefined(alert2.id)) {
            // If setting id is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetWeightThresholdExcerptNo.SettingIDIsnotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.SettingId,
            });
        }

        if (!Number.isInteger(alert1.id) || !Number.isInteger(alert2.id)) {
            // If setting id is not an integer
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetWeightThresholdExcerptNo.SettingIDIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.SettingId,
            });
        }

        if (
            (alert1.id !== ThresholdSettingId.SettingOne && alert1.id !== ThresholdSettingId.SettingTwo) ||
            (alert2.id !== ThresholdSettingId.SettingOne && alert2.id !== ThresholdSettingId.SettingTwo)
        ) {
            // If setting id other than 1 or 2 is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetWeightThresholdExcerptNo.SettingIDOther1Or2Specified,
                messageType: MessageType.Invalid,
                fields: MessageField.SettingId,
            });
        }

        if (alert1.id === alert2.id) {
            // If the same threshold setting number is specified for two thresholds
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueIsIllegal,
                excerptNo: SetWeightThresholdExcerptNo.SettingIDSameForTowThreshold,
                messageType: MessageType.MustBeUnique,
                fields: MessageField.SettingId,
            });
        }

        if (isNullOrUndefined(alert1.enabled_flag) || isNullOrUndefined(alert2.enabled_flag)) {
            // If enabled_flag is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetWeightThresholdExcerptNo.EnabledFlagIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.EnabledFlag,
            });
        }

        if (!Number.isInteger(alert1.enabled_flag) || !Number.isInteger(alert2.enabled_flag)) {
            // If enabled_flag is not an integer
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetWeightThresholdExcerptNo.EnabledFlagIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.EnabledFlag,
            });
        }

        if (
            (alert1.enabled_flag !== ThresholdEnabledFlag.OFF && alert1.enabled_flag !== ThresholdEnabledFlag.ON) ||
            (alert2.enabled_flag !== ThresholdEnabledFlag.OFF && alert2.enabled_flag !== ThresholdEnabledFlag.ON)
        ) {
            // If enabled_flag other than 0 or 1 is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetWeightThresholdExcerptNo.EnabledFlagOther0Or1Specified,
                messageType: MessageType.Invalid,
                fields: MessageField.EnabledFlag,
            });
        }

        if (
            (alert1.enabled_flag === ThresholdEnabledFlag.ON && isNullOrUndefined(alert1.value)) ||
            (alert2.enabled_flag === ThresholdEnabledFlag.ON && isNullOrUndefined(alert2.value))
        ) {
            // If enabled_flag is ON and value is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetWeightThresholdExcerptNo.ValueIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.Value,
            });
        }

        if (
            (alert1.value && isNaN(alert1.value)) ||
            (alert2.value && isNaN(alert2.value))
        ) {
            // If value is entered and not a number
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetWeightThresholdExcerptNo.ValueIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.Value,
            });
        }

        if (
            alert1.value < thresholdMin || alert1.value > thresholdMax ||
            alert2.value < thresholdMin || alert2.value > thresholdMax
        ) {
            // If value outside the range of [Lower limit of weight threshold setting] to [Upper limit of weight threshold setting] is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetWeightThresholdExcerptNo.ValueOutSideTheRange,
                messageType: MessageType.Invalid,
                fields: MessageField.Value,
            });
        }

        if (isNullOrUndefined(alert1.unit) || isNullOrUndefined(alert2.unit)) {
            // If unit is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetWeightThresholdExcerptNo.UnitIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.Unit,
            });
        }

        if (!Number.isInteger(alert1.unit) || !Number.isInteger(alert2.unit)) {
            // If unit is not an integer
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetWeightThresholdExcerptNo.UnitIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.Unit,
            });
        }

        if (
            (alert1.unit !== ThresholdUnit.Kg && alert1.unit !== ThresholdUnit.Lbs) ||
            (alert2.unit !== ThresholdUnit.Kg && alert2.unit !== ThresholdUnit.Lbs)
        ) {
            // If unit other than 1 or 2 is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetWeightThresholdExcerptNo.UnitOther1Or2Specified,
                messageType: MessageType.Invalid,
                fields: MessageField.Unit,
            });
        }

        if (
            (alert1.enabled_flag === ThresholdEnabledFlag.ON && isNullOrUndefined(alert1.period)) ||
            (alert2.enabled_flag === ThresholdEnabledFlag.ON && isNullOrUndefined(alert2.period))
        ) {
            // If enabled_flag is ON and period is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetWeightThresholdExcerptNo.PeriodIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.Period,
            });
        }

        if (
            (alert1.period && !Number.isInteger(alert1.period)) ||
            (alert2.period && !Number.isInteger(alert2.period))
        ) {
            // If period is entered and not an integer number
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetWeightThresholdExcerptNo.PeriodIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.Period,
            });
        }

        if (
            alert1.period < periodMin || alert1.period > periodMax ||
            alert2.period < periodMin || alert2.period > periodMax
        ) {
            // If period outside the range of [Set lower limit of weight period] to [Set upper limit of weight period] is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetWeightThresholdExcerptNo.PeriodOutSideTheRange,
                messageType: MessageType.Invalid,
                fields: MessageField.Period,
            });
        }

        return true;
    }

    /**
     * Get threshold limit
     * @param req Request
     * @param settingKeys string[]
     */
    async getThresholdLimit(req: Request, settingKeys: string[]): Promise<Setting | ProblemException> {
        let setting: Setting;
        try {
            const thresholdSetting = await this.settingService.getValueByKeys(settingKeys);
            if (thresholdSetting instanceof ProblemException) {
                return ProblemException.API_InternalServerError();
            }
            // Get data from setting table, if value is empty => log fatal return
            const weightThresholdMax = thresholdSetting.find(r => r.setting_key === Keys.weight_threshold_max)?.setting_value;
            if (isNullOrUndefined(weightThresholdMax)) {
                return this.logFatal(req, Keys.weight_threshold_max);
            }

            const weightThresholdMin = thresholdSetting.find(r => r.setting_key === Keys.weight_threshold_min)?.setting_value;
            if (isNullOrUndefined(weightThresholdMin)) {
                return this.logFatal(req, Keys.weight_threshold_min);
            }

            const weightPeriodMax = thresholdSetting.find(r => r.setting_key === Keys.weight_period_max)?.setting_value;
            if (isNullOrUndefined(weightPeriodMax)) {
                return this.logFatal(req, Keys.weight_period_max);
            }

            const weightPeriodMin = thresholdSetting.find(r => r.setting_key === Keys.weight_period_min)?.setting_value;
            if (isNullOrUndefined(weightPeriodMin)) {
                return this.logFatal(req, Keys.weight_period_min);
            }
            // map setting value to number,
            setting = {
                weightThresholdMax: +weightThresholdMax,
                weightThresholdMin: +weightThresholdMin,
                weightPeriodMax: +weightPeriodMax,
                weightPeriodMin: +weightPeriodMin,
            };
            return setting;
        } catch (ex) {
            const result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }
    }

    /**
     * Log fatal.
     * @param req Request
     * @param message
     */
    logFatal(req: Request, message = '') {
        const result = ProblemException.API_InternalServerError();
        RpmLogger.fatal(req, result, message);
        return result;
    }
}
