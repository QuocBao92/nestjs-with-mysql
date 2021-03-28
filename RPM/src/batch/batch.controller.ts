/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Controller, HttpStatus, HttpException, Get, Req } from '@nestjs/common';
import { Result } from '../models';
import { BatchService } from './batch.service';
import * as Constants from '../common/constants';
import { IsBatchRunningStatus, CallBatchFrom } from '../common';
@Controller('call-batch')
export class CallBatchController {
    constructor(
        private readonly batchService: BatchService,
    ) { }
    @Get('summaryVital')
    async call(@Req() req: any) {
        const isManual = req.query.isManual === CallBatchFrom.Manual;
        if (isManual === true) {
            process.env.isBatchRunning = IsBatchRunningStatus.ON;
            this.batchService.handleCronJobs();
            const result = { result: new Result({ code: '0' }) };
            throw new HttpException(result, HttpStatus.OK);
        } else if (process.env.isBatchRunning !== IsBatchRunningStatus.ON
            || !process.env.TIME_RUN_BATCH
            || +(process.env.TIME_RUN_BATCH) - new Date().getTime() <= 0) {
            process.env.isBatchRunning = IsBatchRunningStatus.ON;
            const curTime = new Date().getTime();
            process.env.TIME_RUN_BATCH = (curTime + Constants.MAX_TIME_RUN_BATCH_VITAL).toString();
            this.batchService.handleCronJobs();
            const result = { result: new Result({ code: '0' }) };
            throw new HttpException(result, HttpStatus.OK);
        }
        const err = { result: new Result({ code: '0', message: Constants.MSG_BATCH_VITAL_RUNNING }) };
        throw new HttpException(err, HttpStatus.CONFLICT);
    }

    @Get('removeSession')
    async removeSession() {
        await this.batchService.removeSessionExpire();
        const result = { result: new Result({ code: '0' }) };
        throw new HttpException(result, HttpStatus.OK);
    }
}
