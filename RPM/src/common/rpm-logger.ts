/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ErrorCode, ProblemException } from './error-code';
import { Logger } from './cloudwatch-logs';
import { RpmEntryName } from './enums';
import { Request } from 'express';

export class RpmLogger {

    static fatal(req, result, message?: string) {
        if (result instanceof ProblemException) {
            Logger.fatal(message, this.getRpmEntryName(req), req,
                { result: ErrorCode.generateResult(req, result) }, req.query.elapsedStart);
        } else {
            Logger.fatal(message, this.getRpmEntryName(req), req, result, req.query.elapsedStart);
        }
    }

    static info(req, result, message?: string) {
        if (result instanceof ProblemException) {
            Logger.info(message, this.getRpmEntryName(req), req,
                { result: ErrorCode.generateResult(req, result) }, req.query.elapsedStart);
        } else {
            Logger.info(message, this.getRpmEntryName(req), req, result, req.query.elapsedStart);
        }
    }

    static error(req, result, message?: string) {
        if (result instanceof ProblemException) {
            Logger.error(message, this.getRpmEntryName(req), req,
                { result: ErrorCode.generateResult(req, result) }, req.query.elapsedStart);
        } else {
            Logger.error(message, this.getRpmEntryName(req), req, result, req.query.elapsedStart);
        }
    }

    static debug(req, result, message?: string) {
        if (result instanceof ProblemException) {
            Logger.debug(message, this.getRpmEntryName(req), req,
                { result: ErrorCode.generateResult(req, result) }, req.query.elapsedStart);
        } else {
            Logger.debug(message, this.getRpmEntryName(req), req, result, req.query.elapsedStart);
        }
    }

    static warn(req, result, message?: string) {
        if (result instanceof ProblemException) {
            Logger.warn(message, this.getRpmEntryName(req), req,
                { result: ErrorCode.generateResult(req, result) }, req.query.elapsedStart);
        } else {
            Logger.warn(message, this.getRpmEntryName(req), req, result, req.query.elapsedStart);
        }
    }

    /**
     * Get entry name from request
     * @param req Request
     */
    static getRpmEntryName(req: Request): RpmEntryName {
        return Object.keys(RpmEntryName)
            .map(key => RpmEntryName[key])
            .find(val => val === `api-${
                req.path
                    .replace('/dashboard/', '')
                    .replace('/foresight/', '')
                }`);
    }
}
