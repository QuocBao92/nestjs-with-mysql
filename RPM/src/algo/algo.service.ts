/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Problem, Requester, ErrorCode, ErrorType, ClassificationCode, BatchEntryName } from '../common';
import {
    RequestDetectBradycarDia, RequestDetectContraryTrendsBpAndPulse,
    RequestDetectDownTrendBp, RequestDetectLowBP, RequestDetectUpTrend,
} from './model/request-model';
import {
    ResponseDetectBradycarDia,
    ResponseDetectContraryTrendsAndPulse,
    ResponseDetectDownTrendBP,
    ResponseDetectLowBP,
    ResponseDetectUpTrendBP,
} from './model/response-model';

import { Logger } from '../common/cloudwatch-logs';
import { Injectable } from '@nestjs/common';
import { SettingService } from '../setting/setting.service';

@Injectable()
export class AlgoService {
    /**
     * # Api to call ALGO
     * #Item Name: algo_api
     */
    // tslint:disable-next-line:variable-name
    algo_api: any;

    /**
     * Constructor of Algo Service
     * @param settingService SettingService
     * @param requester Requester
     */
    constructor(private settingService: SettingService, private requester: Requester, private logger: Logger) {
        this.algo_api = process.env.ALGO_API;
    }

    // B2bAuthorization
    /**
     * DetectUpTrendBp
     * @param body RequestDetectUpTrend
     * @param entryName EntryName
     */
    async detectUpTrendBp(body: RequestDetectUpTrend, entryName: any): Promise<ResponseDetectUpTrendBP | any | Problem> {
        // Get api detectUpTrendBP from algo
        const url = `${this.algo_api}/detectUpTrendBP`;
        return await this.retryPostData<ResponseDetectUpTrendBP>(url, body, entryName);
    }

    /**
     * detectDownTrendBP
     * @param body RequestDetectDownTrendBp
     * @param entryName EntryName
     */
    async detectDownTrendBP(body: RequestDetectDownTrendBp, entryName: any): Promise<ResponseDetectDownTrendBP | any | Problem> {
        // Get api detectDownTrendBP from algo
        const url = `${this.algo_api}/detectDownTrendBP`;
        // Content type
        return await this.retryPostData<ResponseDetectDownTrendBP>(url, body, entryName);
    }

    /**
     * detectContraryTrendsBPandPulse
     * @param body RequestDetectContraryTrendsBpAndPulse
     * @param entryName EntryName
     */
    async detectContraryTrendsBPandPulse(body: RequestDetectContraryTrendsBpAndPulse, entryName: any):
        Promise<ResponseDetectContraryTrendsAndPulse | any | Problem> {
        // Get api detect Contrary Trends blood pressure andPulse from algo
        const url = `${this.algo_api}/detectContraryTrendsBPandPulse`;
        // Content type
        return await this.retryPostData<ResponseDetectContraryTrendsAndPulse>(url, body, entryName);
    }

    /**
     * detectBradycardia
     * @param body RequestDetectBradycarDia
     * @param entryName EntryName
     */
    async detectBradycardia(body: RequestDetectBradycarDia, entryName: any): Promise<ResponseDetectBradycarDia | any | Problem> {
        // Get api detectBradycardia from algo
        const url = `${this.algo_api}/detectBradycardia`;
        // Content type
        return await this.retryPostData<ResponseDetectBradycarDia>(url, body, entryName);
    }

    /**
     * detectLowBP
     * @param body RequestDetectLowBP
     * @param entryName EntryName
     */
    async detectLowBP(body: RequestDetectLowBP, entryName: any): Promise<ResponseDetectLowBP | any | Problem> {
        // Get detect Low blood pressure from algo
        const url = `${this.algo_api}/detectLowBP`;
        // Content type
        return await this.retryPostData<ResponseDetectLowBP>(url, body, entryName);
    }

    /**
     * retryPostData
     * @param url string
     * @param body any
     * @param option any
     * @param entryName EntryName
     */
    async  retryPostData<T>(url: string, body: any, entryName: any, option?: any) {
        // Get value of algo_retry_times from table (settingInfo)
        let retryTimes = 0;
        let retryInterval = 0;
        try {
            retryTimes = +await this.settingService.getValueByKey('algo_retry_times');
        } catch (ex) {
            Logger.fatal('algo_retry_times', BatchEntryName.BatchWeightAlert,
                {
                    content: ErrorCode.generalErrorCode(null, null,
                        ErrorType.A, ClassificationCode.AlgoError),
                }, ex);
            return Problem;
        }
        // Get value of algo_retry_interval from table (settingInfo)
        try {
            retryInterval = +await this.settingService.getValueByKey('algo_retry_interval');
        } catch (ex) {
            Logger.fatal('algo_retry_interval', BatchEntryName.BatchWeightAlert,
                {
                    content: ErrorCode.generalErrorCode(null, null,
                        ErrorType.A, ClassificationCode.AlgoError),
                }, ex);
            return Problem;
        }
        // HA server API request acceptance date and time
        return await this.requester.retryPostRequest<T>(url, body, retryTimes, retryInterval, entryName, true, option);
    }
}
