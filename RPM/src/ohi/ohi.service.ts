/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Logger } from '../common/cloudwatch-logs';
import { Problem, Requester, ErrorCode, ErrorType, ClassificationCode, OHIEntryName } from '../common';
import {
    RequestBodyGetPersonalBPInfo,
    RequestBodySendBPAlert,
    RequestBodySetPersonalBPInfo,
    RequestGetPersonalInfo,
    RequestGetTakingMedicineInfo,
    RequestGetVitalAverageData,
    RequestGetVitalData,
    RequestHeartAdvisorUserId,
    RequestWeightInfo,
    RequestPrescriptionInfo,
    RequestSideEffectInfo,
    RequestSetWeightThresholdOHI,
    RequestGetWeightThreshold,
} from './models/request-model';

import { Injectable } from '@nestjs/common';
import { SettingService } from '../setting/setting.service';

export interface RetrySetting {
    retry_times: number;
    retry_interval: number;
}

@Injectable()
export class OhiService {
    // tslint:disable-next-line:variable-name
    ohi_api;
    constructor(private settingService: SettingService, private requester: Requester) {
        this.ohi_api = process.env.OHI_API;
    }

    /**
     * getHAID from OHI
     * @param query : RequestHeartAdvisorUserId
     * @param entryName : EntryName
     */
    async getHAID(query: RequestHeartAdvisorUserId, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getHAID`;
        const result = await this.retryPostData(url, query, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetHAID, query, result, elapsedStart);
        return result;
    }

    /**
     * get Personal Information from OHI
     * @param query RequestGetPersonalInfo
     * @param entryName EntryName
     */
    async getPersonalInfo(query: RequestGetPersonalInfo, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getPersonalInfo`;
        const result = await this.retryPostData(url, query, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetPersonalInfo, query, result, elapsedStart);
        return result;
    }

    /**
     * Get weight information from OHI
     * @param query RequestWeightInfo
     * @param entryName EntryName
     */
    async getWeightInfo(
        query: RequestWeightInfo, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getWeightInfo`;
        const result = await this.retryPostData(url, query, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetWeightInfo, query, result, elapsedStart);
        return result;
    }

    /**
     * get Vital Data from OHI
     * @param query RequestGetVitalData
     * @param entryName EntryName
     */
    async getVitalData(query: RequestGetVitalData, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getVitalData`;
        const result = await this.retryPostData(url, query, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetVitalData, query, result, elapsedStart);
        return result;
    }

    /**
     * setWeightThreshold
     * @param query RequestSetWeightThresholdOHI
     * @param entryName EntryName
     */
    async setWeightThreshold(query: RequestSetWeightThresholdOHI, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/setWeightThreshold`;
        const result = await this.retryPostData(url, query, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiSetWeightThreshold, query, result, elapsedStart);
        return result;
    }

    /**
     * get Vital Average Data from OHI
     * @param query RequestGetVitalAverageData
     * @param entryName EntryName
     */
    async getVitalAverageData(
        query: RequestGetVitalAverageData, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getVitalAverageData`;
        const result = await this.retryPostData(url, query, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetVitalAverageData, query, result, elapsedStart);
        return result;
    }

    /**
     * get Prescription Information from OHI
     * @param query RequestPrescriptionInfo
     * @param entryName EntryName
     */
    async getPrescriptionInfo(
        query: RequestPrescriptionInfo, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getPrescriptionInfo`;
        const result = await this.retryPostData(url, query, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetPrescriptionInfo, query, result, elapsedStart);
        return result;
    }

    /**
     * get Taking Medicine Information from OHI
     * @param query RequestGetTakingMedicineInfo
     * @param entryName EntryName
     */
    async getTakingMedicineInfo(
        query: RequestGetTakingMedicineInfo, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getTakingMedicineInfo`;
        const result = await this.retryPostData(url, query, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetTakingMedicineInfo, query, result, elapsedStart);
        return result;
    }

    /**
     * get Side Effect Information from OHI
     * @param query RequestSideEffectInfo
     * @param entryName EntryName
     */
    async getSideEffectInfo(query: RequestSideEffectInfo, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getSideEffectInfo`;
        const result = await this.retryPostData(url, query, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetSideEffectInfo, query, result, elapsedStart);
        return result;
    }

    /**
     * get Blood Pressure of Personal from OHi
     * @param query RequestBodyGetPersonalBPInfo
     * @param entryName EntryName
     */
    async getPersonalBPInfo(
        body: RequestBodyGetPersonalBPInfo, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getPersonalBPInfo`;
        const result = await this.retryPostData(url, body, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetPersonalBPInfo, body, result, elapsedStart);
        return result;
    }

    /**
     * set Blood Pressure of Personal
     * @param body RequestBodySetPersonalBPInfo
     * @param entryName EntryName
     */
    async setPersonalBPInfo(
        body: RequestBodySetPersonalBPInfo, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/setPersonalBPInfo`;
        const result = await this.retryPostData(url, body, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiSetPersonalBPInfo, body, result, elapsedStart);
        return result;
    }

    /**
     * send Blood Pressure Alert
     * @param body RequestBodySendBPAlert
     * @param entryName EntryName
     */
    async sendBPAlert(
        body: RequestBodySendBPAlert, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/sendBPAlert`;
        // Return result after retry api.
        const result = await this.retryPostData(url, body, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiSendBPAlert, body, result, elapsedStart);
        return result;
    }

    /**
     * get Weight Threshold
     * @param body RequestGetWeightThreshold
     * @param entryName EntryName
     */
    async getWeightThreshold(
        body: RequestGetWeightThreshold, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number)
        : Promise<any | Problem> {
        const elapsedStart = new Date().getTime();
        const url = `${this.ohi_api}/getWeightThreshold`;
        // Return result after retry api.
        const result = await this.retryPostData(url, body, entryName, isHasSetting, retryTimes, retryInterval);
        Logger.debug('', OHIEntryName.ApiGetWeightThreshold, body, result, elapsedStart);
        return result;
    }

    /**
     * retry Get Data
     * @param url string
     * @param apiName string
     * @param entryName EntryName
     */
    async retryGetData<T>(url: string, apiName: string, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number) {
        // Get value of (ohi_retry_interval) from table (settingInfo)
        if (!isHasSetting) {
            const setting = await this.getRetrySetting(entryName);
            if (setting instanceof Problem) {
                return Problem;
            } else {
                retryTimes = (setting as RetrySetting).retry_times;
                retryInterval = (setting as RetrySetting).retry_interval;
            }
        }
        return await this.requester.retryGetRequest<T>(url, retryTimes, retryInterval, entryName, false);
    }

    /**
     * retry Post Data
     * @param url string
     * @param body any
     * @param entryName EntryName
     */
    async retryPostData(url: string, body: any, entryName: any, isHasSetting?: boolean, retryTimes?: number, retryInterval?: number) {
        // Get value of (ohi_retry_interval) from table (settingInfo)
        if (!isHasSetting) {
            const setting = await this.getRetrySetting(entryName);
            if (setting instanceof Problem) {
                return setting;
            } else {
                retryTimes = (setting as RetrySetting).retry_times;
                retryInterval = (setting as RetrySetting).retry_interval;
            }
        }
        return await this.requester.retryPostRequest(url, body, retryTimes, retryInterval, entryName, false);
    }

    /**
     * Get retrytimes and retryinterval from DB setting
     * @param entryName string
     */
    async getRetrySetting(entryName: string) {
        let retryTimes = 0;
        try {
            retryTimes = +await this.settingService.getValueByKey('ohi_retry_times');
        } catch (ex) {
            Logger.fatal('ohi_retry_times', entryName,
                {
                    content: ErrorCode.generalErrorCode(null, null,
                        ErrorType.A, ClassificationCode.OhiError),
                }, ex);
            return new Problem();
        }
        let retryInterval = 0;
        try {
            retryInterval = +await this.settingService.getValueByKey('ohi_retry_interval');
        } catch (ex) {
            Logger.fatal('ohi_retry_interval', entryName,
                {
                    content: ErrorCode.generalErrorCode(null, null,
                        ErrorType.A, ClassificationCode.OhiError),
                }, ex);
            return new Problem();
        }
        return { retry_times: retryTimes, retry_interval: retryInterval } as RetrySetting;
    }
}
