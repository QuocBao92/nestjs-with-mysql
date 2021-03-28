/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Body, Controller, Delete, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ProblemException, ResponseProblemException } from '../common';
import { ForesightService } from './foresight.service';
import { RequestRegister, RequestUnRegister } from './model/request-model';
import { RequestGetMedicalTimeOHI } from './model/request-model/getMedical-model';

@Controller('foresight')
export class ForesightController {
    constructor(
        private readonly foresightService: ForesightService,
    ) { }
    /**
     * API User Registration
     * @param req: Request
     * @param body: RequestRegister
     */
    @Post('/registerUser')
    async registerUser(@Req() req: Request, @Body() body: RequestRegister) {
        const result = await this.foresightService.registerUser(req, body);
        if (result instanceof ProblemException) {
            throw new ResponseProblemException(req, result);
        }
        throw new HttpException(result, HttpStatus.OK);
    }

    /**
     * API User Unregistration
     * @param req Request
     * @param body RequestUnRegister
     */
    @Delete('/unregisterUser')
    async unregisterUser(@Req() req: Request, @Body() body: RequestUnRegister) {
        const result = await this.foresightService.unregisterUser(req, body);
        if (result instanceof ProblemException) {
            throw new ResponseProblemException(req, result);
        }
        throw new HttpException(result, HttpStatus.OK);
    }

    /**
     * Examination time acquisition API
     * @param req Request
     * @param body Data Request Get Medical Time
     */
    @Post('/getMedicalTime')
    async getMedicalTime(@Req() req: Request, @Body() body: RequestGetMedicalTimeOHI) {
        const result = await this.foresightService.getMedicalTime(req, body);
        if (result instanceof ProblemException) {
            throw new ResponseProblemException(req, result);
        }
        throw new HttpException(result, HttpStatus.OK);
    }
}
