/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiList, ClassificationCode, CodeType, ErrorType, MessageType, ProcessingType } from './enums';
import { BaseModel, Result } from '../models';
import { HttpException, HttpStatus } from '@nestjs/common';

import { Request } from 'express';
import { isNullOrUndefined } from 'util';

/**
 * Common Error Code
 */
export class ErrorCode {

    /**
     * @param req
     * @param errType errType
     * * A.Internal error of server;
     * * B.Input value error.
     * @param classificationCode classificationCode
     * * 1.Value unsetting;
     * * 2.Unknown value;
     * * 3.The form is illegal;
     * * 4.The range is illegal;
     * * 5.The character number is illegal;
     * * 6.Character that cannot be used;
     * * 7.The value is illegal;
     * * 8.The number of excess;
     * * 901.The JSON form is illegal;
     * * 902.The method is illegal;
     * * 903.The contents type is illegal;
     * * 904.Data size excess;
     * * 905.Attestation error;
     * * 906.Access right error;
     * * 999.Internal error.
     * generalErrorCode
     * @param req Request
     * @param processingType ProcessingType
     * @param errType ErrorType
     * @param classificationCode ClassificationCode
     * @param excerptNo number
     */
    public static generalErrorCode(
        req: Request,
        processingType?: ProcessingType,
        errType?: ErrorType,
        classificationCode?: ClassificationCode,
        excerptNo?: number,
        processingNumber?: number) {

        // default code
        if (isNullOrUndefined(processingType)) { processingType = ProcessingType.APIforDoctorDashboard; }
        if (isNullOrUndefined(errType)) { errType = ErrorType.B; }
        if (isNullOrUndefined(classificationCode)) { classificationCode = 0; }
        if (isNullOrUndefined(excerptNo)) { excerptNo = 0; }

        // One error type digit
        const e = this.errorTypeOneDigit(errType).error_type;
        // Three processing type digits
        const a = this.apiNumberTreble(processingType, req, processingNumber);
        // One method type digit
        const m = this.methodTypeOneDigit(req, processingType);
        // Three classification
        const c = this.classificationCodeTreble(classificationCode);
        // Four parameter number digits
        const ex = this.excerptNo(excerptNo);
        return `${e}${a}${m}${c}${ex}`;
    }

    /**
     * errorTypeOneDigit
     * @param errType A: Internal error of server; B: Input value error
     */
    public static errorTypeOneDigit(errType: ErrorType) {
        const lst = [
            {
                error_type: 'A',
                usage: 'Internal error of server',
                cause: 'Error that originates in processing of RPM server side as failure in DB connection etc.',
            },
            {
                error_type: 'B',
                usage: 'Input value error',
                cause: 'Error that originates in parameter passed from API call origin',
            },
        ];
        // default B
        return lst.find(t => t.error_type === errType) || lst[1];
    }

    /**
     * apiNumberTreble
     * @param processingType ProcessingType
     * @param req Request
     */
    public static apiNumberTreble(processingType: ProcessingType, req: Request, processingNumber: number) {
        let result: string;
        if (!req) {
            result = processingNumber ? processingNumber.toString() : '0';
        } else if (req.path === '/foresight/getMedicalTime') {
            result = ApiList.getMedicalTimeOHI + '';
        } else {
            const path = req.path.replace('/dashboard/', '').replace('/foresight/', '');
            result = ApiList[path] || '0';
        }
        while (result.toString().length < 2) {
            result = '0' + result;
        }
        return `${processingType}${result}`;
    }

    /**
     * methodTypeOneDigit
     * @param req Request
     */
    public static methodTypeOneDigit(req?: Request, processingType?: ProcessingType) {
        const methods = [{
            code: 'G',
            name: 'GET',
        },
        {
            code: 'A',
            name: 'POST',
        },
        {
            code: 'U',
            name: 'PUT',
        },
        {
            code: 'D',
            name: 'DELETE',
        },
        {
            code: 'B',
            name: 'BatchProcessing',
        },
        ];
        const method = processingType === 2 ? 'BatchProcessing' : req?.method;
        return methods.find(m => m.name === method)?.code;
    }

    /**
     * classificationCodeTreble
     * @param classificationCode ClassificationCode
     */
    public static classificationCodeTreble(classificationCode: ClassificationCode) {
        const classifications = [
            {
                classification_code: 1,
                value: '001',
                distinguished_name: 'Value unsetting',
                generation_reason: 'When you set an empty value to the item of the can\'t be omitted. ',
            },
            {
                classification_code: 2,
                value: '002',
                distinguished_name: 'Unknown value',
                generation_reason: 'When you specify the value that doesn\'t exist. ',
            },
            {
                classification_code: 3,
                value: '003',
                distinguished_name: 'The form is illegal.',
                generation_reason: 'When the mistake is found in the form at the date.When setting it to the place where the numerical value should be specified excluding the numerical value.\'t exist. ',
            },
            {
                classification_code: 4,
                value: '004',
                distinguished_name: 'The range is illegal.',
                generation_reason: 'When you specify the numerical value outside the tolerance or the date.\'t exist. ',
            },
            {
                classification_code: 5,
                value: '005',
                distinguished_name: 'The character number is illegal. ',
                generation_reason: 'When you exceed the number of characters that can be registered.\'t exist. ',
            },
            {
                classification_code: 6,
                value: '006',
                distinguished_name: 'Character that cannot be used. ',
                generation_reason: 'When the character that cannot be used is included.\'t exist. ',
            },
            {
                classification_code: 7,
                value: '007',
                distinguished_name: 'The value is illegal. ',
                generation_reason: 'Exist, and as a value when it is not possible to use it.\'t exist. ',
            },
            {
                classification_code: 8,
                value: '008',
                distinguished_name: 'The number of excess ',
                generation_reason: 'When you exceed the number of cases to which the data number can be processed.\'t exist. ',
            },
            {
                classification_code: 901,
                value: '901',
                distinguished_name: 'The JSON form is illegal. ',
                generation_reason: 'When the form of JSON is illegal.\'t exist. ',
            },
            {
                classification_code: 902,
                value: '902',
                distinguished_name: 'The method is illegal. ',
                generation_reason: 'When the specification of the method is illegal.\'t exist. ',
            },
            {
                classification_code: 903,
                value: '903',
                distinguished_name: 'The contents type is illegal. ',
                generation_reason: 'When the specification of the contents type is illegal.\'t exist. ',
            },
            {
                classification_code: 904,
                value: '904',
                distinguished_name: 'Data size excess. ',
                generation_reason: 'When the data size of the request exceeds it.\'t exist. ',
            },
            {
                classification_code: 905,
                value: '905',
                distinguished_name: 'Attestation error',
                generation_reason: 'When API attestation error between VPC occurs.',
            },
            {
                classification_code: 906,
                value: '906',
                distinguished_name: 'Access right error. ',
                generation_reason: 'When there is no right of access in Internet Protocol address in the request origin.\'t exist. ',
            },
            {
                classification_code: 907,
                value: '907',
                distinguished_name: 'Session or access token has expired. ',
                generation_reason: 'When session or access token has expired.',
            },
            {
                classification_code: 908,
                value: '908',
                distinguished_name: 'Not Found. ',
                generation_reason: 'When there is not found data.\'t exist. ',
            },
            {
                classification_code: 911,
                value: '911',
                distinguished_name: 'Request OHI-API Error',
                generation_reason: ' When the error occurs by the response of OHI-API and the batch terminates abnormally',
            },
            {
                classification_code: 913,
                value: '913',
                distinguished_name: 'Db Patient Error',
                generation_reason: ' When batch is abnormally terminated due to inconsistency of registered patient information',
            },
            {
                classification_code: 914,
                value: '914',
                distinguished_name: 'Db Master Error',
                generation_reason: 'When the expected parameter does not exist in the setting information master',
            },
            {
                classification_code: 999,
                value: '999',
                distinguished_name: 'Internal error',
                generation_reason: 'When the error occurs by processing in the RPM server as the failure in the DB connection etc.\'t exist. ',
            },
        ];
        return classifications.find(t => t.classification_code === classificationCode)?.value || '000';
    }

    /**
     * excerptNo
     * @param excerptNo number
     */
    public static excerptNo(excerptNo: number) {
        // default 0000
        if (!excerptNo) {
            return '0000';
        }
        let excerpt = excerptNo.toString();
        while (excerpt.length < 4) {
            excerpt = '0' + excerpt;
        }
        return excerpt;
    }

    /**
     * generate result object
     * @param req
     * @param problem
     */
    public static generateResult(req: Request, problem: ProblemException) {
        const code = problem.code !== 1 && !isNullOrUndefined(problem.code)
            ? ErrorCode.generalErrorCode(req, problem.processingType, problem.errorType, problem.classificationCode, problem.excerptNo)
            : '0';
        const message = problem.message ? problem.message : this.message(problem.messageType, problem.fields);
        return new Result({ code, message });
    }

    /**
     * message
     * @param type MessageType
     * @param field string | string[]
     */
    public static message(type?: MessageType, field?: string | string[]) {
        switch (type) {
            case MessageType.AuthFailed: {
                return `Auth failed.`;
            }
            case MessageType.SessionExpired: {
                return `SessionID has expired.`;
            }
            case MessageType.AuthHasExpired: {
                return `Auth has expired.`;
            }
            case MessageType.NotValid: {
                return `${field} is not valid`;
            }
            case MessageType.InternalServerError: {
                return `Internal Server Error`;
            }
            case MessageType.IsRequired: {
                return `${field} is required`;
            }
            case MessageType.InvalidFormat: {
                return `Invalid ${field} format.`;
            }
            case MessageType.Invalid: {
                return `Invalid ${field}.`;
            }
            case MessageType.MustBeNewerThan: {
                return `${field[0]} must be newer than ${field[1]}.`;
            }
            case MessageType.MustBeLowerThan: {
                return `${field[0]} must be lower than ${field[1]}.`;
            }
            case MessageType.MustBeANumber: {
                return `${field} must be a number.`;
            }
            case MessageType.MustBeObjectArray: {
                return `${field} must be object array.`;
            }
            case MessageType.MustBeUnique: {
                return `${field} must be unique.`;
            }
            case MessageType.CasesExceedsTheRange: {
                return `${field} cases exceeds the range.`;
            }
            case MessageType.Conflict: {
                return `Conflict ${field}.`;
            }
            case MessageType.IsDeleted: {
                return `${field} is deleted.`;
            }
            case MessageType.IsNotFound: {
                return `Data does not exist.`;
            }
            case MessageType.SessionIDCertificationFailed: {
                return 'SessionID certification failed';
            }
            case MessageType.JSONMessageIsNotParseable: {
                return 'The provided JSON message is not parseable.';
            }
            case MessageType.Mustbe64Characters: {
                return `${field} must be 64 characters`;
            }
            case MessageType.MustbeAlphanumeric: {
                return `${field} must be alphanumeric`;
            }
        }
        return '';
    }

}

/**
 * * status
 * * code: Nomally or at the error
 * * errorType
 * * classificationCode
 * * excerptNo
 * * message
 */
// tslint:disable-next-line:max-classes-per-file
export class ProblemException extends BaseModel {
    public status: number;
    public code: CodeType;
    public processingType: ProcessingType;
    public errorType?: ErrorType;
    public classificationCode?: number;
    public excerptNo?: number;
    public message?: string;
    public fields?: string;
    public messageType?: MessageType;

    /**
     * Bad Request JSON Is Not Correct
     */
    public static BadRequest_JSONIsNotCorrect() {
        return new ProblemException({
            status: HttpStatus.BAD_REQUEST,
            code: CodeType.AtTheError,
            classificationCode: ClassificationCode.JSONFormIsIllegal,
            messageType: MessageType.JSONMessageIsNotParseable,
        });
    }

    /**
     * Forbidden AuthFailed
     */
    public static Forbidden_AuthFailed() {
        return new ProblemException({
            status: HttpStatus.FORBIDDEN,
            code: CodeType.AtTheError,
            classificationCode: ClassificationCode.AttestationError,
            messageType: MessageType.AuthFailed,
        });
    }

    /**
     * Forbidden SessionID Has Expired
     */
    public static Forbidden_SessionIDHasExpired() {
        return new ProblemException({
            status: HttpStatus.FORBIDDEN,
            code: CodeType.AtTheError,
            classificationCode: ClassificationCode.AttestationExpired,
            messageType: MessageType.SessionExpired,
        });
    }

    /**
     * Unauthorized SessionID Certification Failed
     */
    public static Unauthorized_SessionIDCertificationFailed() {
        return new ProblemException({
            status: HttpStatus.UNAUTHORIZED,
            code: CodeType.AtTheError,
            classificationCode: ClassificationCode.AttestationError,
            messageType: MessageType.SessionIDCertificationFailed,
        });
    }

    /**
     * Unauthorized AuthFailed
     */
    public static Unauthorized_AuthFailed() {
        return new ProblemException({
            status: HttpStatus.FORBIDDEN,
            code: CodeType.AtTheError,
            classificationCode: ClassificationCode.AttestationError,
            messageType: MessageType.AuthFailed,
        });
    }

    /**
     * Unauthorized InternalServerError
     */
    public static Unauthorized_InternalServerError() {
        return new ProblemException({
            status: HttpStatus.UNAUTHORIZED,
            code: CodeType.AtTheError,
            classificationCode: ClassificationCode.InternalError,
            messageType: MessageType.InternalServerError,
        });
    }

    /**
     * Unauthorized Token Expired
     */
    public static Unauthorized_TokenExpired() {
        return new ProblemException({
            status: HttpStatus.FORBIDDEN,
            code: CodeType.AtTheError,
            errorType: ErrorType.B,
            classificationCode: ClassificationCode.AttestationExpired,
            messageType: MessageType.AuthHasExpired,
        });
    }

    /**
     * Response Error Internal Server Error
     * status : 500
     * messseage: Internal Server Error
     */
    public static API_InternalServerError(processingType?: ProcessingType) {
        return new ProblemException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            processingType,
            errorType: ErrorType.A,
            code: CodeType.AtTheError,
            classificationCode: ClassificationCode.InternalError,
            messageType: MessageType.InternalServerError,
        });
    }

    /**
     * Single Sign On Error
     * Return Internal Server Error with status 302.
     */
    public static SSO_InternalServerError() {
        return new ProblemException({
            status: HttpStatus.FOUND,
            errorType: ErrorType.A,
            code: CodeType.AtTheError,
            classificationCode: ClassificationCode.InternalError,
            messageType: MessageType.InternalServerError,
        });
    }

    /**
     * Return Internal Server Error with status 302.
     */
    public static SSO_AuthFailed() {
        return new ProblemException({
            status: HttpStatus.FOUND,
            errorType: ErrorType.A,
            code: CodeType.AtTheError,
            classificationCode: ClassificationCode.AttestationError,
            messageType: MessageType.AuthFailed,
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ResponseProblemException {

    /**
     * Constructor of class ResponseProblemException
     * @param req :Request
     * @param problem :ProblemException
     */
    constructor(req: Request, problem: ProblemException) {
        const result = ErrorCode.generateResult(req, problem);
        let statusCode = HttpStatus.NOT_FOUND;
        switch (problem.status) {
            case HttpStatus.OK:
            case HttpStatus.BAD_REQUEST:
            case HttpStatus.METHOD_NOT_ALLOWED:
            case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
            case HttpStatus.PAYLOAD_TOO_LARGE:
            case HttpStatus.UNAUTHORIZED:
            case HttpStatus.FORBIDDEN:
            case HttpStatus.INTERNAL_SERVER_ERROR:
            case HttpStatus.FOUND:
            case HttpStatus.CONFLICT:
                statusCode = problem.status;
                break;
            default: {
                break;
            }
        }
        const err = new HttpException({ result }, statusCode);
        throw err;
    }
}
