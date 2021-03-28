/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';
import {
    ClassificationCode, CodeType, GetMedicalTimeExcerptNo, Helper, MessageField, MessageType,
    ProblemException, RpmLogger, SetMedicalTimeExcerptNo, TIMEZONE,
} from '../common';
import { Result } from '../models';
import { MedicalTime } from './entity/medical-time.entity';
import { RequestGetMedicalTimeService, SetMedicalTimeModel } from './model/patient-model';
import { RequestGetMedicalTime } from './model/request-model/request-get-medical-time';
import { RequestSetMedicalTime } from './model/request-model/request-set-medical-time';
import { MedicalTimeResponseModel } from './model/response-model';
import moment = require('moment');

@Injectable()
export class MedicalTimeService {
    constructor(
        @InjectRepository(MedicalTime)
        private readonly medicalTimeRepository: Repository<MedicalTime>,
    ) { }

    /**
     * API set medical time
     * @param req HTTP request
     * @param requestMedicalTime SetMedicalTimeModel
     */
    async setMedicalTime(req: Request, body: RequestSetMedicalTime): Promise<Result | ProblemException> {
        const param = new SetMedicalTimeModel({
            ha_user_id: req.query.current_ha_user_id,
            start_timestamp: body.start_timestamp,
            timezone: body.timezone,
            medical_time: body.medical_time,
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
        result = this.checkValidationSetMedicalTime(param);
        if (result instanceof ProblemException) {
            RpmLogger.error(req, result);
            return result;
        }

        // (3) Register the consultation time in the consultation time measurement information table
        // Calculate date from the count start date and time zone of request parameter
        const startDate = moment(param.start_timestamp).utcOffset(param.timezone).format('YYYY-MM-DD');
        const rqSetMedicalTimeModel = new SetMedicalTimeModel({
            access_token: req.query.access_token,
            ha_user_id: param.ha_user_id,
            start_timestamp: param.start_timestamp,
            start_date: startDate,
            timezone: param.timezone,
            medical_time: param.medical_time,
        });
        try {
            // If the same primary key (access token + HeartAdvisorUserID + count start date and time)
            // has already been registered, the consultation time will be updated.
            const medicalTimes = await this.medicalTimeRepository.findOne(
                {
                    access_token: req.query.access_token,
                    ha_user_id: rqSetMedicalTimeModel.ha_user_id,
                    start_timestamp: rqSetMedicalTimeModel.start_timestamp,
                },
            );
            if (!medicalTimes) {
                // Check if primary key (access token + HeartAdvisorUserID + count start date and time) is not registered
                // will insert a new record into database
                await this.medicalTimeRepository.save(rqSetMedicalTimeModel);
            } else {
                // Update field medical_time of the record corresponding to the primary key if it exists
                medicalTimes.medical_time = param.medical_time;
                await this.medicalTimeRepository.save(medicalTimes);
            }
        } catch {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }

        // (4) Create and return response data
        result = new Result({
            code: '0',
        });
        RpmLogger.info(req, { result });
        return result;
    }

    /**
     * Function to check validation of request object
     * @param requestObj Object contain request parameter
     */
    checkValidationSetMedicalTime(requestObj: SetMedicalTimeModel): true | ProblemException {
        if (isNullOrUndefined(requestObj.start_timestamp)) {
            // If start_timestamp is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetMedicalTimeExcerptNo.StartTimeStampIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.StartTimestamp,
            });
        }

        if (isNaN(requestObj.start_timestamp) || !Number.isInteger(requestObj.start_timestamp)) {
            // If the format of start_timestamp is not numeric
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetMedicalTimeExcerptNo.StartTimeStampIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.StartTimestamp,
            });
        }

        if (isNullOrUndefined(requestObj.timezone)) {
            // If timezone is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetMedicalTimeExcerptNo.TimeZoneIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.Timezone,
            });
        }

        if (!TIMEZONE.test(requestObj.timezone)) {
            // If the format of timezone is not "±hh:mm"
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetMedicalTimeExcerptNo.TimeZoneFormatInvalid,
                messageType: MessageType.InvalidFormat,
                fields: MessageField.Timezone,
            });
        }

        if (isNullOrUndefined(requestObj.medical_time)) {
            // If medical_time is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: SetMedicalTimeExcerptNo.MedicalTimeIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.MedicalTime,
            });
        }

        if (isNaN(requestObj.medical_time) || !Number.isInteger(requestObj.medical_time)) {
            // If the format of medical_time is not numeric
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: SetMedicalTimeExcerptNo.MedicalTimeIsNotInteger,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.MedicalTime,
            });
        }

        if (requestObj.medical_time < 0) {
            // If the value of medical_time is less than 0
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: SetMedicalTimeExcerptNo.MedicalTimeIsLessThan0,
                messageType: MessageType.Invalid,
                fields: MessageField.MedicalTime,
            });
        }

        return true;
    }

    /**
     * Consultation time acquisition API
     * @param req HTTP request
     * @param param RequestGetMedicalTimeService
     */
    async getMedicalTime(req: Request, body: RequestGetMedicalTime): Promise<any | ProblemException> {
        const param = new RequestGetMedicalTimeService({
            ha_user_id: req.query.current_ha_user_id,
            monthly_start_date: body.monthly_start_date,
            monthly_end_date: body.monthly_end_date,
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
        result = this.checkValidationGetMedicalTime(param);
        if (result instanceof ProblemException) {
            RpmLogger.error(req, result);
            return result;
        }

        // (3) Monthly consultation time acquisition
        // Specify as the acquisition start date of the monthly consultation time, using the "Examination time first reference date of the month"
        // acquired with the common API

        // The array containing medical_time is retrieved from the database
        let medicalTimes = [];
        try {
            // Obtain information that meets the following conditions from the consultation time measurement information table
            medicalTimes = await this.medicalTimeRepository
                .createQueryBuilder()
                .select('SUM(medical_time)', 'medical_time')
                .where('ha_user_id = :haid', { haid: param.ha_user_id })
                .andWhere('start_date >= :monthly_start_date', { monthly_start_date: param.monthly_start_date })
                .andWhere('start_date <= :monthly_end_date', { monthly_end_date: param.monthly_end_date })
                .getRawMany();
        } catch {
            // If error when connect DB
            const err = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, err);
            return err;
        }

        // Because method getRawMany() always return an array of object although the target record does not exist,
        // so we need to check field 'medical_time' of first object of array result to get total of consultation time
        // and treated as "monthly consultation time"
        const totalMedicalTime = !isNullOrUndefined(medicalTimes[0].medical_time) ? +medicalTimes[0].medical_time : 0;

        // (4) Create and return response data
        result = new MedicalTimeResponseModel({
            result: new Result({ code: '0' }),
            monthly_medical_time: totalMedicalTime,
        });

        RpmLogger.info(req, result);
        return result;
    }

    /**
     * Function to check validation of request API getMedicalTime
     * @param param RequestGetMedicalTimeService
     */
    checkValidationGetMedicalTime(param: RequestGetMedicalTimeService): boolean | ProblemException {
        if (isNullOrUndefined(param.monthly_start_date)) {
            // If monthly_start_date is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: GetMedicalTimeExcerptNo.MonthlyStartDateIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.MonthlyStartDate,
            });
        }

        if (!Helper.isValidFormatDate(param.monthly_start_date)) {
            // If the format of monthly_start_date is not a date
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: GetMedicalTimeExcerptNo.MonthlyStartDateIsNotADate,
                messageType: MessageType.InvalidFormat,
                fields: MessageField.MonthlyStartDate,
            });
        }

        if (!moment(param.monthly_start_date).isValid()) {
            // If a non-existent date of monthly_start_date is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.UnknownValue,
                excerptNo: GetMedicalTimeExcerptNo.MonthlyStartDateDoNotExistIsSpecified,
                messageType: MessageType.Invalid,
                fields: MessageField.MonthlyStartDate,
            });
        }

        if (isNullOrUndefined(param.monthly_end_date)) {
            // If monthly_end_date is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.ValueUnsetting,
                excerptNo: GetMedicalTimeExcerptNo.MonthlyEndDateIsNotInput,
                messageType: MessageType.IsRequired,
                fields: MessageField.MonthlyEndDate,
            });
        }

        if (!Helper.isValidFormatDate(param.monthly_end_date)) {
            // If the format of monthly_end_date is not a date
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.FormIllegal,
                excerptNo: GetMedicalTimeExcerptNo.MonthlyEndDateIsNotADate,
                messageType: MessageType.InvalidFormat,
                fields: MessageField.MonthlyEndDate,
            });
        }

        if (!moment(param.monthly_end_date).isValid()) {
            // If a non-existent date of monthly_end_date is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.UnknownValue,
                excerptNo: GetMedicalTimeExcerptNo.MonthlyEndDateDoNotExistIsSpecified,
                messageType: MessageType.Invalid,
                fields: MessageField.MonthlyEndDate,
            });
        }

        if (param.monthly_end_date < param.monthly_start_date) {
            // When a value older than the day when the monthly consultation time is calculated is specified on the day
            // when the monthly consultation time is closed
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                classificationCode: ClassificationCode.RangeIsIllegal,
                excerptNo: GetMedicalTimeExcerptNo.MonthlyEndDateEarlierThanMonthlyStartDate,
                messageType: MessageType.MustBeNewerThan,
                fields: [MessageField.MonthlyEndDate, MessageField.MonthlyStartDate],
            });
        }

        return true;
    }
}
