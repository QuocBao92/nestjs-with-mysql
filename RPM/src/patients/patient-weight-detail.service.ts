/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as moment from 'moment';
import { isNullOrUndefined } from 'util';
import { ClassificationCode, CodeType, Helper, MessageField, MessageType, OHIEntryName, Problem, ProblemException, RpmLogger, VitalData } from '../common';
import * as Constants from '../common/constants';
import { WeightDetailExcerptNo } from '../common/excerpt-no';
import { Result } from '../models';
import { RequestGetVitalData } from '../ohi/models/request-model';
import { OhiService } from '../ohi/ohi.service';
import { RequestWeightDetailService } from './model/patient-model/request-weight-detail-service';
import { PatientInformationWeight } from './model/response-model/get-weight-detail/patient-information-weight';
import { RequestWeightDetail } from './model/request-model/request-weight-detail';
import { WeightDetail } from './model/response-model';
@Injectable()
export class PatientWeightDetailService {
    /**
     * Constructor of Patient Weight Detail Service
     * @param ohiService OhiService
     */
    constructor(
        private readonly ohiService: OhiService,
    ) { }

    /**
     *  Get Weight Detail Service
     * @param req Request
     * @param body Data Request Weight Detail
     */
    async getWeightDetail(req: Request, body: RequestWeightDetail): Promise<WeightDetail | ProblemException> {
        const param = new RequestWeightDetailService({
            ha_user_id: req.query.current_ha_user_id,
            date_from: body.date_from,
            date_to: body.date_to,
        });
        let result: any;
        // (1) Perform access token authentication
        if (isNullOrUndefined(param.ha_user_id)) {
            // Get HA-ID list from session data, if the HA - ID list is not included in the session data,
            // return an error response(99. Common error: Authentication error)
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
        result = this.inputCheck(param);
        if (result instanceof ProblemException) {
            RpmLogger.error(req, result);
            return result;
        }

        // (3) Patient information acquisition
        // param Request api get vital data
        const requestVitalData = new RequestGetVitalData({
            // HeartAdvisorUserID
            ha_user_id: param.ha_user_id,
            // 2: Weight
            type: VitalData.WeightType,
            // 3:Automatic & Manual input
            input_type: VitalData.AutomaticAndManualInputType,
            // 1: Measurement date
            date_type: VitalData.MeasurementDateType,
            // Start of Time Range
            start: param.date_from + Constants.TIME_START_DATE,
            // End of Time Range
            end: param.date_to + Constants.TIME_END_DATE,
        });

        // The object containing weight information acquisition from OHI API 'getVitalData'
        const weightDatas = await this.getWeightData(requestVitalData);
        if (weightDatas instanceof Problem) {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }

        if (!weightDatas || weightDatas.length === 0) {
            // Return an empty array if there is no weight information
            result = new WeightDetail({
                result: new Result({ code: '0' }),
                weight_data: [],
            });
            RpmLogger.info(req, result);
            return result;
        }

        // The array containing result object of request
        // tslint:disable-next-line: variable-name
        const weight_data = weightDatas.map(weightData => {
            // If successful retrieves datas from OHI, loop through array 'vitalDatas', create data and push into array 'weightDatas'
            return new PatientInformationWeight({
                // Date get from OHI is in second format, so need to convert to millisecond to calculate date time
                date_time: moment(weightData.date * 1000).utcOffset(weightData.timezone).format('YYYY-MM-DDTHH:mm:ssZ'),
                input_type: weightData.input_type,
                weight_kg: weightData.weight_kg,
                weight_lbs: weightData.weight_lbs,
                bmi: isNullOrUndefined(weightData.bmi) ? undefined : weightData.bmi,
            });
        });

        // (4) Create and return response data
        result = new WeightDetail({
            result: new Result({ code: '0' }),
            weight_data,
        });

        RpmLogger.info(req, result);
        return result;
    }

    /**
     * Input check data request weight detail
     * @param param Param Request Weight Detail Patient Service
     */
    private inputCheck(param: RequestWeightDetailService): true | ProblemException {
        if (isNullOrUndefined(param.date_from)) {
            // If not entered date_from then return it problem.
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: WeightDetailExcerptNo.StartDateIsNotInPut,
                messageType: MessageType.IsRequired,
                fields: MessageField.DateFrom,
            });
        }

        if (!Helper.isValidFormatDate(param.date_from)) {
            // If date_from the format is not a date then return it problem.
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: WeightDetailExcerptNo.StartDateIsNotADate,
                messageType: MessageType.InvalidFormat,
                fields: MessageField.DateFrom,
            });
        }

        if (!moment(param.date_from).isValid()) {
            // If date_from a non-existent date is specified.
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.UnknownValue,
                excerptNo: WeightDetailExcerptNo.StartDateDoNotExistIsSpecificed,
                messageType: MessageType.Invalid,
                fields: MessageField.DateFrom,
            });
        }

        if (isNullOrUndefined(param.date_to)) {
            // If not entered date_to then return it problem.
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: WeightDetailExcerptNo.EndDateIsNotInPut,
                messageType: MessageType.IsRequired,
                fields: MessageField.DateTo,
            });
        }

        if (!Helper.isValidFormatDate(param.date_to)) {
            // If date_to the format is not a date then return it problem.
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: WeightDetailExcerptNo.EndDateDoNotExistIsSpecificed,
                messageType: MessageType.InvalidFormat,
                fields: MessageField.DateTo,
            });
        }

        if (!moment(param.date_to).isValid()) {
            // If date_to a non-existent date is specified.
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.UnknownValue,
                excerptNo: WeightDetailExcerptNo.EndDateIsNotADate,
                messageType: MessageType.Invalid,
                fields: MessageField.DateTo,
            });
        }

        if (param.date_to < param.date_from) {
            // If a value earlier than the acquisition period date_to is specified on the acquisition period date_from.
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: WeightDetailExcerptNo.EndDateEarlierThanStartDate,
                messageType: MessageType.MustBeNewerThan,
                fields: [MessageField.DateTo, MessageField.DateFrom],
            });
        }

        return true;
    }

    /**
     * Get weight data from OHI
     * @param param Parameter Request Get Vital Data
     */
    private async getWeightData(param: RequestGetVitalData): Promise<any> {
        // The object containing vitalData from OHI
        const vitalData = await this.ohiService.getVitalData(param, OHIEntryName.ApiGetVitalData);
        if (vitalData instanceof Problem) {
            return vitalData;
        }
        return vitalData?.vital_data;
    }
}
