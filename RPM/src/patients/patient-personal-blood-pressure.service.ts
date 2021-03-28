/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { isNullOrUndefined } from 'util';
import {
    ClassificationCode, CodeType, Keys, MessageField, MessageType, OHIEntryName, Problem,
    ProblemException, RpmLogger, SetPersonalBloodPressureExcerptNo,
} from '../common';
import { Result } from '../models';
import { RequestBodyGetPersonalBPInfo, RequestBodySetPersonalBPInfo } from '../ohi/models/request-model';
import { OhiService } from '../ohi/ohi.service';
import { SettingService } from '../setting/setting.service';
import { SetPersonalBloodPressureModel } from './model/patient-model';
import { GetPersonalBloodPressure } from './model/response-model/get-personal-blood-pressure';

export interface Setting {
    sysMax: number;
    sysMin: number;
    diaMax: number;
    diaMin: number;
}

@Injectable()
export class PatientPersonalBpService {
    // Array contains the setting variables
    settingKeys = [Keys.sys_max, Keys.dia_max, Keys.sys_min, Keys.dia_min];

    /**
     * Constructor of Patient Get Set Target Blood Pressure Service
     * @param ohiService OhiService
     * @param settingService SettingService
     */
    constructor(
        private readonly ohiService: OhiService,
        private readonly settingService: SettingService,
    ) { }

    /**
     * Api get personal blood pressure.
     * @param query GetPersonalBloodPressureModel
     */
    async getPersonalBloodPressure(req: Request)
        : Promise<GetPersonalBloodPressure | Result | ProblemException> {

        const current_ha_user_id = req.query.current_ha_user_id;

        let result;
        // (1) Perform access token authentication
        if (isNullOrUndefined(current_ha_user_id)) {
            // If the HA - ID list is not included in the session data, return an error response(No applicable information: 404 NOT FOUND)
            result = new ProblemException({
                status: HttpStatus.NOT_FOUND,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.IsNotFound,
                messageType: MessageType.IsNotFound,
            });
            RpmLogger.warn(req, result);
            return result;
        }
        // Request params api get personal blood pressure information.
        const requestBodyGetPersonalBPInfo = new RequestBodyGetPersonalBPInfo({
            ha_user_id: [current_ha_user_id],
        });

        // (2)Information of blood pressure of target and threshold acquisition
        // #API get personal blood pressure info.
        const personalBPInfo = await this.ohiService.getPersonalBPInfo(requestBodyGetPersonalBPInfo, OHIEntryName.ApiGetPersonalBPInfo);
        if (isNullOrUndefined(personalBPInfo) || personalBPInfo instanceof Problem) {
            // Check reponses status.
            result = ProblemException.API_InternalServerError();
            RpmLogger.error(req, result);
            return result;
        }

        // Acquire the upper and lower limits of the maximum and minimum blood pressure settings from the setting information master table.
        const setting = await this.getBpLimit(req, this.settingKeys);
        if (setting instanceof ProblemException) {
            return setting;
        }
        // #Synthesis Data.
        // Initialize item personal blood pressure.
        const personalBlItem = personalBPInfo.bp_info ? personalBPInfo.bp_info[0] : undefined;

        // 	(3)The response data is made and it returns it.
        // Initialize object targetBloodPressure.
        result = new GetPersonalBloodPressure({
            result: new Result({ code: '0' }),
            target_sys: personalBlItem?.goal_sys,
            target_dia: personalBlItem?.goal_dia,
            threshold_sys: personalBlItem?.sys_threshold,
            threshold_dia: personalBlItem?.dia_threshold,
            sys_max: setting.sysMax,
            sys_min: setting.sysMin,
            dia_max: setting.diaMax,
            dia_min: setting.diaMin,
        });
        RpmLogger.info(req, result);
        return result;
    }

    /**
     * Api set target blood pressure.
     * @param query SetPersonalBloodPressureModel
     */
    async setPersonalBloodPressure(req: Request, query: SetPersonalBloodPressureModel): Promise<Result | ProblemException> {
        let result;
        // (1) Perform access token authentication
        // Get HA-ID list from session data
        if (isNullOrUndefined(query.ha_user_id)) {
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
        // Acquire the upper and lower limits of the maximum and minimum blood pressure settings from the setting information master table.
        const setting = await this.getBpLimit(req, this.settingKeys);
        if (setting instanceof ProblemException) {
            return setting;
        }

        //#region (2) Input check
        result = this.inputCheck(query, setting);
        if (result instanceof ProblemException) {
            RpmLogger.fatal(req, result);
            return result;
        }
        //#endregion

        // (3)Notification of blood pressure
        // Request blood pressure.
        const requestSetPersonalBPInfo = new RequestBodySetPersonalBPInfo({
            ha_user_id: query.ha_user_id,
            goal_sys: query.target_sys,
            goal_dia: query.target_dia,
            threshold_sys: query.threshold_sys,
            threshold_dia: query.threshold_dia,
        });

        // Notification of personal blood pressure
        // Call Api set personal blood pressure from OHI.
        const setPersonalBPInfo = await this.ohiService.setPersonalBPInfo(requestSetPersonalBPInfo, OHIEntryName.ApiSetPersonalBPInfo);
        if (isNullOrUndefined(setPersonalBPInfo) || setPersonalBPInfo instanceof Problem) {
            // If the personal blood pressure API returns an error, an error response is returned ([500 Internal Server Error])
            result = ProblemException.API_InternalServerError();
            RpmLogger.error(req, result);
            return result;

        }

        // Responses status.
        result = new Result({
            code: '0',
        });
        RpmLogger.info(req, { result });
        return result;
    }

    /**
     * Input Check
     * @param query
     * @param setting
     */
    inputCheck(query, setting): true | ProblemException {

        //#region (2) Input check
        // Target systolic blood pressure
        if (isNullOrUndefined(query.target_sys)) {
            // When it is not input
            // Initialize object problem responses status.
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetPersonalBloodPressureExcerptNo.TargetSysIsNotInPut,
                messageType: MessageType.IsRequired,
                fields: MessageField.TargetSys,
            });
        }
        if (isNaN(query.target_sys)) {
            // When the form is not an integer
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.TargetSysIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.TargetSys,
            });
        }
        if (query.target_sys < Number(setting.sysMin) || query.target_sys > Number(setting.sysMax)) {
            // When a number outside the range from [systolic blood pressure setting lower limit]
            // to [systolic blood pressure setting upper limit] is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.TargetSysOutsidetSpecifiedRange,
                messageType: MessageType.Invalid,
                fields: MessageField.TargetSys,
            });
        }

        // Target diastolic blood pressure
        if (isNullOrUndefined(query.target_dia)) {
            // When it is not input
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetPersonalBloodPressureExcerptNo.TargetDiaIsNotInPut,
                messageType: MessageType.IsRequired,
                fields: MessageField.TargetDia,
            });
        }
        if (isNaN(query.target_dia)) {
            // When the form is not an integer
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.TargetDiaIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.TargetDia,
            });
        }
        if (query.target_dia < Number(setting.diaMin) || query.target_dia > Number(setting.diaMax)) {
            // When a number out of the range from [Lowest blood pressure setting lower limit]
            // to [Lowest blood pressure setting upper limit] is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.TargetDiaOutsidetSpecifiedRange,
                messageType: MessageType.Invalid,
                fields: MessageField.TargetDia,
            });
        }
        if (query.target_dia > query.target_sys) {
            // When the target diastolic blood pressure is larger than the target systolic blood pressure
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.TargetDiaLargerThanSys,
                messageType: MessageType.MustBeLowerThan,
                fields: [MessageField.TargetDia, MessageField.TargetSys],
            });
        }
        // Threshold systolic blood pressure
        if (isNullOrUndefined(query.threshold_sys)) {
            // When it is not input
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetPersonalBloodPressureExcerptNo.ThresholdSysIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.ThresholdSys,
            });
        }
        if (isNaN(query.threshold_sys)) {
            // When the form is not an integer
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.ThresholdSysIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.ThresholdSys,
            });
        }
        if (query.threshold_sys < Number(setting.sysMin) || query.threshold_sys > Number(setting.sysMax)) {
            // When a number outside the range from [systolic blood pressure setting lower limit]
            // to [systolic blood pressure setting upper limit] is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.ThresholdSysInvalid,
                messageType: MessageType.Invalid,
                fields: MessageField.ThresholdSys,
            });
        }
        if (query.threshold_sys <= query.target_sys) {
            // When a value lower than the target systolic blood pressure is specified as the threshold systolic blood pressure
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.ThresholdSysOutsidetSpecifiedRange,
                messageType: MessageType.MustBeLowerThan,
                fields: [MessageField.TargetSys, MessageField.ThresholdSys],
            });
        }

        // Threshold diastolic blood pressure
        if (isNullOrUndefined(query.threshold_dia)) {
            // When it is not input
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetPersonalBloodPressureExcerptNo.ThresholdDiaIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.ThresholdDia,
            });
        }
        if (isNaN(query.threshold_dia)) {
            // When the form is not an integer
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.ThresholdDiaIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.ThresholdDia,
            });
        }
        if (query.threshold_dia < Number(setting.diaMin) || query.threshold_dia > Number(setting.diaMax)) {
            // When a number out of the range from [Lowest blood pressure setting lower limit]
            // to [Lowest blood pressure setting upper limit] is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.ThresholdDiaOutsidetSpecifiedRange,
                messageType: MessageType.Invalid,
                fields: MessageField.ThresholdDia,
            });
        }
        if (query.threshold_dia > query.threshold_sys) {
            // When the target diastolic blood pressure is larger than the target systolic blood pressure
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.ThresholdDiaLargerThanThresholdSys,
                messageType: MessageType.MustBeLowerThan,
                fields: [MessageField.ThresholdDia, MessageField.ThresholdSys],
            });
        }
        if (query.target_dia >= query.threshold_dia) {
            // When the target diastolic blood pressure is larger than the target systolic blood pressure
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetPersonalBloodPressureExcerptNo.TargetDiaLargerThenThresholdDia,
                messageType: MessageType.MustBeLowerThan,
                fields: [MessageField.TargetDia, MessageField.ThresholdDia],
            });
        }

        return true;
        //#endregion

    }

    /**
     * Acquire the upper and lower limits of the maximum and minimum blood pressure settings from the setting information master table.
     * @param settingKeys : array
     */
    async getBpLimit(req: Request, settingKeys: string[]): Promise<Setting | ProblemException> {
        let setting: Setting;
        try {
            const bpLimit = await this.settingService.getValueByKeys(settingKeys);
            if (bpLimit instanceof ProblemException) {
                return ProblemException.API_InternalServerError();
            }
            // Get data from setting table, if value is empty => log fatal return
            const sysMax = bpLimit.find(r => r.setting_key === Keys.sys_max)?.setting_value;
            if (isNullOrUndefined(sysMax)) {
                return this.logFatal(req, Keys.sys_max);
            }

            const diaMax = bpLimit.find(r => r.setting_key === Keys.dia_max)?.setting_value;
            if (isNullOrUndefined(diaMax)) {
                return this.logFatal(req, Keys.dia_max);
            }

            const sysMin = bpLimit.find(r => r.setting_key === Keys.sys_min)?.setting_value;
            if (isNullOrUndefined(sysMin)) {
                return this.logFatal(req, Keys.sys_min);
            }

            const diaMin = bpLimit.find(r => r.setting_key === Keys.dia_min)?.setting_value;
            if (isNullOrUndefined(diaMin)) {
                return this.logFatal(req, Keys.dia_min);
            }
            // map setting value to number,
            setting = {
                sysMax: +sysMax,
                diaMax: +diaMax,
                sysMin: +sysMin,
                diaMin: +diaMin,
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
     * @param message
     */
    logFatal(req: Request, message = '') {
        const result = ProblemException.API_InternalServerError();
        RpmLogger.fatal(req, result, message);
        return result;
    }
}
