/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ErrorCode, ProblemException, ResponseProblemException, RpmEntryName } from '../common';
import { Logger } from '../common/cloudwatch-logs';
import { SsoService } from './sso.service';

@ApiBearerAuth()
// dashboard/login
@Controller('dashboard')
export class SsoController {
    /**
     * Constructor of Single Sign On Controller
     * @param ssoService SsoService
     * @param logger Logger
     */
    constructor(
        private readonly ssoService: SsoService,
    ) { }

    /**
     * login
     * @param req Request
     * @param res any
     */
    @Post('login')
    async sso(@Req() req: Request, @Res() res: Response) {
        const elapsedStart = new Date().getTime();
        // Call api login from ssoService
        const result = await this.ssoService.login(req, res);
        if (result instanceof ProblemException) {
            // If result have type Problem then retry log and return problem
            Logger.error('', RpmEntryName.ApiLogin, req, ErrorCode.generateResult(req, result), elapsedStart);
            throw new ResponseProblemException(req, result);
        }
        // Retry log
        Logger.info('', RpmEntryName.ApiLogin, { authorization: req.headers.authorization }, result, elapsedStart);
        throw new HttpException(result, HttpStatus.FOUND);

    }

}
