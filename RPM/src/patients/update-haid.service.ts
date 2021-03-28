/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNullOrUndefined } from 'util';
import { PatientContract } from './entity/patient-contract.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { RequestUpdateHaid } from './model/request-model/request-update-haid';
import { Result } from '../models';
import { TableSession } from '../sso/entity/table_session.entity';
import {
    ProblemException, CodeType, ClassificationCode, MessageType,
    MessageField, Helper, UpdateHaidExcerptNo, DeleteFlag, RpmLogger,
} from '../common';

export class UpdateHaidService {

    /**
     * Constructor of Single Sign On Service
     * @param sessionRepository Repository<TableSession>
     */
    constructor(
        @InjectRepository(TableSession)
        private readonly sessionRepository: Repository<TableSession>,

        @InjectRepository(PatientContract)
        private readonly patientContractRepository: Repository<PatientContract>,

    ) {
    }

    /**
     * update current_ha_user_id
     * @param req Request
     * @param body RequestUpdateHaid
     */
    async updateHaid(req: Request, body: RequestUpdateHaid):
        Promise<{ result: Result } | ProblemException> {

        // (2) Input check
        let result: any = await this.validateHaid(req, body.ha_user_id);
        if (result instanceof ProblemException) {
            // Logger - Invalid input parameter - ERROR - API call parameter error.
            RpmLogger.error(req, result);
            return result;
        }

        // (3) HAID registration
        let session: TableSession;
        try {
            // Find session by access_token
            session = await this.sessionRepository.findOne({
                where:
                    { access_token: req.query.access_token },
            });

            // If session not exist return problem
            if (isNullOrUndefined(session)) {
                result = new ProblemException({
                    status: HttpStatus.NOT_FOUND, code: CodeType.AtTheError,
                    classificationCode: ClassificationCode.IsNotFound,
                    messageType: MessageType.IsNotFound,
                });
                RpmLogger.error(req, result);
                return result;
            }

            // change current_ha_user_id
            const info = JSON.parse(session.login_data);
            info.current_ha_user_id = body.ha_user_id;
            session.login_data = JSON.stringify(info);

            // update ha_user_id by session id
            session = await this.sessionRepository.save({
                ...session, session_id: session.session_id,
            });

            // (4) Create and return response data
            result = new Result({ code: '0' });
            // Logger - Successful completion - INFO
            RpmLogger.info(req, { result });
            return { result };

        } catch {
            result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }
    }

    /**
     * (2) Input check
     * @param haid ha_user_id
     */
    async  validateHaid(req, haid: string): Promise<true | ProblemException> {
        if (isNullOrUndefined(haid)) {
            // If not entered
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                excerptNo: UpdateHaidExcerptNo.HaUserIDIsNotInput,
                classificationCode: ClassificationCode.ValueUnsetting,
                messageType: MessageType.IsRequired,
                fields: MessageField.HAID,
            });
        }
        if (!Helper.isAlphanumeric(haid.toString())) {
            // If it is not a string consisting of only alphanumeric characters
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                excerptNo: UpdateHaidExcerptNo.HaUserIDisNotCharacterStringOfAlphanumericAlone,
                classificationCode: ClassificationCode.FormIllegal,
                messageType: MessageType.MustbeAlphanumeric,
                fields: MessageField.HAID,
            });
        }
        if (haid.length !== 64) {
            // If the number of characters is not 64
            return new ProblemException({
                status: HttpStatus.BAD_REQUEST,
                code: CodeType.AtTheError,
                excerptNo: UpdateHaidExcerptNo.HaUserIDIsNot64Characters,
                classificationCode: ClassificationCode.CharacterNumberIllegal,
                messageType: MessageType.Mustbe64Characters,
                fields: MessageField.HAID,
            });
        }

        try {
            const patientContract = await this.patientContractRepository.findOne({ ha_user_id: haid, delete_flag: DeleteFlag.No });
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
            // If error when query
            const result = ProblemException.API_InternalServerError();
            RpmLogger.fatal(req, result);
            return result;
        }
        return true;
    }
}
