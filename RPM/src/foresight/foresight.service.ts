/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { MedicalTime } from '../patients/entity/medical-time.entity';
import { Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';
import {
    ClassificationCode, CodeType, ContractApplication, ContractWeight, DeleteFlag, Helper, MessageField, MessageType,
    ProblemException, ProcessingType, RpmLogger, WeightScale,
} from '../common';
import { GetMedicalTimeOHIExcerptNo, RegisterUserExcerptNo, UnregisterUserExcerptNo } from '../common/excerpt-no';
import TimeUtil from '../common/time-util';
import { Result } from '../models';
import { PatientAggregate } from '../patients/entity/patient-aggregate.entity';
import { PatientContract } from '../patients/entity/patient-contract.entity';
import { RequestUnRegister } from './model/request-model';
import { RequestGetMedicalTimeOHI } from './model/request-model/getMedical-model';
import { RequestRegister } from './model/request-model/register-model';
import { MedicalTimeResponseModel } from './model/response-model';
import { Request } from 'express';
@Injectable()
export class ForesightService {

    /**
     * Contructor of Foresight Service
     * @param patientContractRepository Repository<PatientContract>
     * @param patientWeightThresholdRepository : Repository<PatientWeightThreshold>
     */
    constructor(
        @InjectRepository(PatientContract)
        private readonly patientContractRepository: Repository<PatientContract>,

        @InjectRepository(PatientAggregate)
        private patientAggregateRepository: Repository<PatientAggregate>,

        @InjectRepository(MedicalTime)
        private readonly medicalTimeRepository: Repository<MedicalTime>,
    ) {

    }

    /**
     * Register User
     * @param query RequestRegister
     * @param req Request
     */
    async registerUser(req: any, query: RequestRegister): Promise<{ result: Result } | ProblemException> {
        let result;
        // [1] Check the input
        result = this.validateRegisterUser(query);
        // Return an error response if have problem.
        if (result instanceof ProblemException) {
            RpmLogger.error(req, result);
            return result;
        }

        // Confirmation of patient information registration status
        let patientcontract;
        try {
            patientcontract = await this.patientContractRepository.findOne({ ha_user_id: query.ha_user_id });
        } catch (err) {
            result = ProblemException.API_InternalServerError(ProcessingType.APIForOHI);
            RpmLogger.fatal(req, result);
            return result;
        }
        // Check patientcontract exists
        if (!patientcontract) {
            patientcontract = new PatientContract();
            patientcontract.ha_user_id = query.ha_user_id;
            patientcontract.delete_flag = DeleteFlag.No;
            // List (weight) is hidden. The detail side operates according to the body composition meter contract OFF;
            patientcontract.contract_weight = ContractWeight.No;
            patientcontract.contract_application = query.smartphone_use;
            patientcontract.ha_regist_date = new Date(query.ha_regist_date);
            try {
                // Patient information registration
                await this.patientContractRepository.save(patientcontract);
            } catch (err) {
                result = ProblemException.API_InternalServerError(ProcessingType.APIForOHI);
                RpmLogger.fatal(req, result);
                return result;
            }

        } else if (patientcontract.delete_flag === DeleteFlag.Yes) {
            //  If a record exists in the patient contract information table and the delete flag is 1 , the record is updated
            try {
                await this.patientContractRepository.save({
                    ...{
                        delete_flag: DeleteFlag.No,
                        contract_weight: ContractWeight.No,  // Contract of weight is hidden,
                        contract_application: query.smartphone_use,
                        ha_regist_date: query.ha_regist_date,
                    }, ha_user_id: query.ha_user_id,
                });
            } catch {
                result = ProblemException.API_InternalServerError(ProcessingType.APIForOHI);
                RpmLogger.fatal(req, result);
                return result;
            }
        } else if (patientcontract.delete_flag === DeleteFlag.No) {
            // If a record exists and the unsubscription flag is 0 (contracted), an error response is returned
            result = new ProblemException({
                status: HttpStatus.CONFLICT,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.ConflictHAID,
                classificationCode: ClassificationCode.ValueConflit,
                messageType: MessageType.Conflict,
                fields: MessageField.HAID,
            });
            RpmLogger.info(req, result);
            return result;
        }

        // Insert into Patient summary information table
        const p = new PatientAggregate();
        p.ha_user_id = query.ha_user_id;
        p.ha_request_timestamp = new Date(query.ha_regist_date).getTime();
        try {
            await this.patientAggregateRepository.save(p);
        } catch {
            result = ProblemException.API_InternalServerError(ProcessingType.APIForOHI);
            RpmLogger.fatal(req, result);
            return result;
        }
        result = new Result({ code: '0' });
        RpmLogger.info(req, { result });
        return { result };
    }

    /**
     * Validate Register User
     * @param query RequestRegister
     */
    validateRegisterUser(query: RequestRegister): boolean | ProblemException {
        if (isNullOrUndefined(query.ha_user_id) || query.ha_user_id.length === 0) {
            // HeartAdvisorUserID
            // If not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.HaUserIDIsNotInput,
                classificationCode: ClassificationCode.ValueUnsetting,
                messageType: MessageType.IsRequired,
                fields: MessageField.HAID,
            });
        }
        if (!Helper.isAlphanumeric(query.ha_user_id.toString())) {
            // If it is not a string consisting of only alphanumeric characters
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.HaUserIDisIncludeAlphanumericAlone,
                classificationCode: ClassificationCode.FormIllegal,
                messageType: MessageType.MustbeAlphanumeric,
                fields: MessageField.HAID,
            });
        }
        if (query.ha_user_id.toString().length !== 64) {
            // If the number of characters is not 64
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.HaUserIDIsNot64Characters,
                classificationCode: ClassificationCode.CharacterNumberIllegal,
                messageType: MessageType.Mustbe64Characters,
                fields: MessageField.HAID,
            });
        }
        if (isNullOrUndefined(query.contract_weight_scale)) {
            // Weight body composition meter contract existence
            // If not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.WeightBodyIsNotInput,
                classificationCode: ClassificationCode.ValueUnsetting,
                messageType: MessageType.IsRequired,
                fields: MessageField.ContractWeigtScale,
            });
        }
        if (isNaN(query.contract_weight_scale)) {
            // When the form is not an integer
            // If the format is not an integer
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.WeightBodyIsNotInteger,
                classificationCode: ClassificationCode.FormIllegal,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.ContractWeigtScale,
            });
        }
        if ((query.contract_weight_scale !== WeightScale.Yes && query.contract_weight_scale !== WeightScale.None)) {
            // 0,1If a number other than is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.WeightBodyOtherThan0And1,
                classificationCode: ClassificationCode.RangeIsIllegal,
                messageType: MessageType.Invalid,
                fields: MessageField.ContractWeigtScale,
            });
        }
        if (isNullOrUndefined(query.smartphone_use)) {
            // Smart phone use existence
            // If not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.SmartPhoneIsNotInput,
                classificationCode: ClassificationCode.ValueUnsetting,
                messageType: MessageType.IsRequired,
                fields: MessageField.UseSmartPhone,
            });
        }
        if (isNaN(query.smartphone_use)) {
            // If the format is not an integer
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.SmartPhoneIsNotInteger,
                classificationCode: ClassificationCode.FormIllegal,
                messageType: MessageType.MustBeANumber,
                fields: MessageField.UseSmartPhone,
            });
        }

        if (query.smartphone_use !== ContractApplication.Yes && query.smartphone_use !== ContractApplication.No) {
            // 0,1 If a number other than is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.SmartPhoneOtherThan0and1,
                classificationCode: ClassificationCode.RangeIsIllegal,
                messageType: MessageType.Invalid,
                fields: MessageField.UseSmartPhone,
            });
        }

        if (isNullOrUndefined(query.ha_regist_date)) {
            // HAID registration date
            // If not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.HaIDRegistrationIsNotInput,
                classificationCode: ClassificationCode.ValueUnsetting,
                messageType: MessageType.IsRequired,
                fields: MessageField.HAIDRegistDate,
            });
        }

        if (!Helper.isValidFormatDate(query.ha_regist_date)) {
            // "YYYY-MM-DD" If not in the format
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.HaIDRegistrationIsNotFrom,
                classificationCode: ClassificationCode.FormIllegal,
                messageType: MessageType.InvalidFormat,
                fields: MessageField.HAIDRegistDate,
            });
        }

        if (!moment(query.ha_regist_date).isValid()) {
            // When the date that doesn't exist is specified
            // If a non-existent date is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.HaIDRegistrationDoNotExistIsSpecified,
                classificationCode: ClassificationCode.UnknownValue,
                messageType: MessageType.Invalid,
                fields: MessageField.HAIDRegistDate,
            });
        }

        if (TimeUtil.isDateFuture(query.ha_regist_date)) {
            // When the date of the future is specified
            // If a future date is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: RegisterUserExcerptNo.HaIDRegistrationDoNotExistIsSpecified,
                classificationCode: ClassificationCode.RangeIsIllegal,
                messageType: MessageType.Invalid,
                fields: MessageField.HAIDRegistDate,
            });
        }
        return true;
    }

    /**
     * Unregister User
     * @param req Request
     * @param query RequestRegister
     */
    async unregisterUser(req: any, query: RequestUnRegister): Promise<{ result: Result } | ProblemException> {
        // HeartAdvisorUserID
        let result;
        result = this.validateUnregisterUser(query);
        if (result instanceof ProblemException) {
            // Input check. Return an error response if have problem
            RpmLogger.error(req, result);
            return result;
        }

        let patientcontract;
        try {
            patientcontract = await this.patientContractRepository.findOne({ ha_user_id: query.ha_user_id });
        } catch (err) {
            result = ProblemException.API_InternalServerError(ProcessingType.APIForOHI);
            RpmLogger.fatal(req, result);
            return result;
        }
        if (!patientcontract) {
            // Check patientcontract exists
            result = new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: UnregisterUserExcerptNo.ConflictHAID,
                classificationCode: ClassificationCode.UnknownValue,
                messageType: MessageType.Invalid,
                fields: MessageField.HAID,
            });
            RpmLogger.info(req, result);
            return result;

        } else if (patientcontract.delete_flag === DeleteFlag.Yes) {
            // Check patientcontract have delete_flag equal 1
            result = new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: UnregisterUserExcerptNo.ConflictHAID,
                classificationCode: ClassificationCode.UnknownValue,
                messageType: MessageType.Invalid,
                fields: MessageField.HAID,
            });
            RpmLogger.info(req, result);
            return result;
        } else {
            // Check patientcontract have delete_flag equal 1
            patientcontract.delete_flag = DeleteFlag.Yes;
            try {
                await this.patientContractRepository.save(patientcontract);
            } catch {
                result = ProblemException.API_InternalServerError(ProcessingType.APIForOHI);
                RpmLogger.fatal(req, result);
                return result;
            }
        }

        result = new Result({ code: '0' });
        RpmLogger.info(req, { result });
        return { result };

    }

    /**
     * Validate Unregister User
     * @param query RequestRegister
     */
    validateUnregisterUser(query: RequestUnRegister): boolean | ProblemException {
        if (isNullOrUndefined(query.ha_user_id.toString())) {
            // Check ha_user_id exists
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: UnregisterUserExcerptNo.HaUserIDIsNotInput,
                classificationCode: ClassificationCode.ValueUnsetting,
                messageType: MessageType.IsRequired,
                fields: MessageField.HAID,
            });
        }
        // If it is not a string consisting of only alphanumeric characters
        if (!Helper.isAlphanumeric(query.ha_user_id.toString())) {
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: UnregisterUserExcerptNo.HaUserIDisNotCharacterStringOfAlphanumericAlone,
                classificationCode: ClassificationCode.FormIllegal,
                messageType: MessageType.MustbeAlphanumeric,
                fields: MessageField.HAID,
            });
        }
        // If the number of characters is not 64
        if (query.ha_user_id.toString().length !== 64) {
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: UnregisterUserExcerptNo.HaUserIDIsNot64Characters,
                classificationCode: ClassificationCode.CharacterNumberIllegal,
                messageType: MessageType.Mustbe64Characters,
                fields: MessageField.HAID,
            });
        }
        return true;
    }

    /**
     * Examination time acquisition API
     * @param req Request
     * @param query RequestGetMedicalTimeOHI
     */
    async getMedicalTime(req: Request, query: RequestGetMedicalTimeOHI): Promise<{ result: Result } | ProblemException> {
        let result: any;
        // (1) Input check
        result = this.validateGetMedicalTime(query);
        // Return an error response if have problem.
        if (result instanceof ProblemException) {
            RpmLogger.error(req, result);
            return result;
        }

        // (2) Confirmation of patient information registration status
        // From the patient contract information table, get the information that "HeartAdvisorUserID" matches the HeartAdvisorUserID
        // of the input value(specified in the array)
        // The array containing list ha_user_id of request parameter
        const haids = query.ha_user_id?.map(id => ({ ha_user_id: id }));
        let patientContracts: PatientContract[];
        try {
            patientContracts = await this.patientContractRepository.find({ where: haids });
        } catch {
            result = ProblemException.API_InternalServerError(ProcessingType.APIForOHI);
            RpmLogger.fatal(req, result);
            return result;
        }

        if (patientContracts.length === 0) {
            // If no record exists, the consultation time is set to "-1" and the process of "(3) Acquisition of consultation time" is not performed.
            const medicalTimeInfo = query.ha_user_id?.map(haid => {
                return {
                    ha_user_id: haid,
                    medical_time: -1,
                };
            });

            result = new MedicalTimeResponseModel({
                result: new Result({ code: '0' }),
                medical_time_info: medicalTimeInfo,
            });

            RpmLogger.info(req, result);
            return result;
        }

        // (3) Acquisition of consultation time
        // The array containing the HAIDs is registered in the 'd_patient_contract' table
        const registeredHAID = patientContracts.map(patientContract => patientContract.ha_user_id);

        // The array containing the records retrieved from the 'd_medical_time' table according to the conditions described
        let rawMedicalTimes = [];
        try {
            rawMedicalTimes = await this.medicalTimeRepository
                .createQueryBuilder()
                .select('ha_user_id')
                .addSelect('SUM(medical_time)', 'medical_time')
                .where('ha_user_id IN (:ha_user_ids)', { ha_user_ids: registeredHAID })
                .andWhere('start_date >= :rq_start_date', { rq_start_date: query.start_date })
                .andWhere('start_date <= :rq_end_date', { rq_end_date: query.end_date })
                .groupBy('ha_user_id')
                .getRawMany();
        } catch {
            result = ProblemException.API_InternalServerError(ProcessingType.APIForOHI);
            RpmLogger.fatal(req, result);
            return result;
        }

        // The array containing the HAIDs of the records retrieved from the 'd_medical_time' table
        const rawMedicalTimesHAIDs = rawMedicalTimes.map(e => e.ha_user_id);

        // The array contains the registered HAIDs in the 'd_patient_contract' table but no records in the 'd_medical_time' table
        const noMedicalTimes = registeredHAID.filter(med => !rawMedicalTimesHAIDs.includes(med));

        // For HAIDs registered in the 'd_patient_contract' table but no records in the 'd_medical_time' table,
        // create objects with field 'medical_time' is 0 and push it into 'rawMedicalTimes' array
        noMedicalTimes.forEach(haId => {
            rawMedicalTimes.push({
                ha_user_id: haId,
                medical_time: 0,
            });
        });

        // The array containing HAIDs are not included in the 'd_patient_contract' table
        const unregisterHAID = query.ha_user_id.filter(user => !registeredHAID.includes(user));
        // Create objects with field 'medical_time' is -1 for HAIDs that are not in the 'd_patient_contract' table,
        // and push it into 'rawMedicalTimes' array
        unregisterHAID.forEach(haId => {
            rawMedicalTimes.push({
                ha_user_id: haId,
                medical_time: -1,
            });
        });

        // The array containing the results of all HAIDs included in the request parameter
        const medicalTimes = rawMedicalTimes.map(medicalTime => {
            if (typeof medicalTime.medical_time === 'string') {
                // Because method getRawMany() of medicalTimeRepository return field 'medical_time' in string format,
                // so we need to convert it into number format and push it into array result: 'medicalTimes'
                return {
                    ha_user_id: medicalTime.ha_user_id,
                    medical_time: Number(medicalTime.medical_time),
                };
            } else {
                // For the elements that no have records in the 'd_medical_time' table, no need to convert it into format number,
                // just push it into array result: 'medicalTimes'
                return {
                    ha_user_id: medicalTime.ha_user_id,
                    medical_time: medicalTime.medical_time,
                };
            }
        });

        // (4) Return success response
        result = new MedicalTimeResponseModel({
            result: new Result({ code: '0' }),
            medical_time_info: medicalTimes,
        });

        RpmLogger.info(req, result);
        return result;
    }

    /**
     * Function to check validation of request getMedicalTime from OHI
     * @param query RequestGetMedicalTimeOHI
     */
    validateGetMedicalTime(query: RequestGetMedicalTimeOHI): true | ProblemException {
        if (isNullOrUndefined(query.ha_user_id) || query.ha_user_id.length === 0) {
            // If HeartAdvisorUserID not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.HaUserIDIsNotInput,
                classificationCode: ClassificationCode.ValueUnsetting,
                messageType: MessageType.IsRequired,
                fields: MessageField.HAID,
            });
        }

        if (query.ha_user_id.find(haid => !Helper.isAlphanumeric(haid.toString()))) {
            // If element of array ha_user_id is not alphanumeric
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.HaUserIDisIncludeAlphanumericAlone,
                classificationCode: ClassificationCode.FormIllegal,
                messageType: MessageType.MustbeAlphanumeric,
                fields: MessageField.HAID,
            });
        }

        if (query.ha_user_id.find(haid => haid.toString().length !== 64)) {
            // If the length of element of array ha_user_id is not 64
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.HaUserIDIsNot64Characters,
                classificationCode: ClassificationCode.CharacterNumberIllegal,
                messageType: MessageType.Mustbe64Characters,
                fields: MessageField.HAID,
            });
        }

        if (isNullOrUndefined(query.start_date)) {
            // If start_date is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.StartDateIsNotInput,
                classificationCode: ClassificationCode.ValueUnsetting,
                messageType: MessageType.IsRequired,
                fields: MessageField.StartDate,
            });
        }

        if (!Helper.isValidFormatDate(query.start_date)) {
            // "YYYY-MM-DD" If not in the format
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.StartDateIsNotADate,
                classificationCode: ClassificationCode.FormIllegal,
                messageType: MessageType.InvalidFormat,
                fields: MessageField.StartDate,
            });
        }

        if (!moment(query.start_date).isValid()) {
            // When the date that doesn't exist is specified
            // If a non-existent date is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.StartDateDoNotExistIsSpecified,
                classificationCode: ClassificationCode.UnknownValue,
                messageType: MessageType.Invalid,
                fields: MessageField.StartDate,
            });
        }

        if (isNullOrUndefined(query.end_date)) {
            // If end_date is not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.EndDateIsNotInput,
                classificationCode: ClassificationCode.ValueUnsetting,
                messageType: MessageType.IsRequired,
                fields: MessageField.EndDate,
            });
        }

        if (!Helper.isValidFormatDate(query.end_date)) {
            // "YYYY-MM-DD" If not in the format
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.EndDateIsNotADate,
                classificationCode: ClassificationCode.FormIllegal,
                messageType: MessageType.InvalidFormat,
                fields: MessageField.EndDate,
            });
        }

        if (!moment(query.end_date).isValid()) {
            // When the date that doesn't exist is specified
            // If a non-existent date is specified
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.EndDateDoNotExistIsSpecified,
                classificationCode: ClassificationCode.UnknownValue,
                messageType: MessageType.Invalid,
                fields: MessageField.EndDate,
            });
        }

        if (query.end_date < query.start_date) {
            // When a value older than the acquisition period start date is specified on the acquisition period end date
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                excerptNo: GetMedicalTimeOHIExcerptNo.EndDateEarlierThanStartDate,
                classificationCode: ClassificationCode.RangeIsIllegal,
                messageType: MessageType.MustBeNewerThan,
                fields: [MessageField.EndDate, MessageField.StartDate],
            });
        }

        return true;
    }
}
