import { RequestSetWeightThreshold } from './../ohi/models/request-model/set-weight-threshold';
import { Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import { CacheService } from '../cache/cache.service';
import { OhiCache } from '../cache/entity';
import { CacheKey } from '../cache/enum';
import { RequestBodySendBPAlert, RequestGetPersonalInfo, RequestHeartAdvisorUserId } from '../ohi/models/request-model';
import { GetHeartAdvisorUserIdModel, SetTargetBP, GetWeightInfo } from '../ohi/models/response-model';
import { Result } from '../ohi/models/response-model/base-model';
import { HeartAdvisorUserID } from '../ohi/models/response-model/get-heart-advisor-user-id/heart-advisor-user-id';
import { GetLatestWeightInfo } from '../ohi/models/response-model/get-latest-weight-info';
import { PatientsVitalInformation } from '../ohi/models/response-model/get-weight-info/patients-vital-information';
import { BloodpressureInfor } from '../ohi/models/response-model/get-personal-bp-info/blood-pressure-info';
import { GetPersonalInfoModel } from '../ohi/models/response-model/get-personal-info';
import { PatientInformation } from '../ohi/models/response-model/get-personal-info/patient-information';
import { GetPrescriptionInfo } from '../ohi/models/response-model/get-prescription-info';
import { MedicinesInformation } from '../ohi/models/response-model/get-prescription-info/medicines-information';
import { GetSiteEffectInfo } from '../ohi/models/response-model/get-side-effect-info';
import { InformationOnSideEffect } from '../ohi/models/response-model/get-side-effect-info/information_on_side_effect';
import { GetTakingMedicineInfo } from '../ohi/models/response-model/get-taking-medicine-info';
import { TakeDateInfo } from '../ohi/models/response-model/get-taking-medicine-info/take-date-info';
import { GetVitalAverageData } from '../ohi/models/response-model/get-vital-average-data';
import { VitalDataAverage } from '../ohi/models/response-model/get-vital-average-data/vital-data-average';
import { GetVitalDataModel } from '../ohi/models/response-model/get-vital-data';
import { VitalInformationBlood } from '../ohi/models/response-model/get-vital-data/vital-information-blood';
import { VitalInformationWeight } from '../ohi/models/response-model/get-vital-data/vital-information-weight';
import { SentAlert } from '../ohi/models/response-model/send-alert/index';
import e = require('express');
import { isNullOrUndefined } from 'util';
import { PatientsThresholdInformation } from 'src/ohi/models/response-model/get-weight-threshold/patients-threshold-information';
import { ThresholdInformation } from 'src/ohi/models/response-model/get-weight-threshold/threshold-model';
import { InitialThreshold } from 'src/ohi/models/response-model/get-weight-threshold/initial-threshold-model';
import { GetWeightThreshold } from '../ohi/models/response-model/get-weight-threshold';

//tslint:disable
@Injectable()
@UseFilters()
export class MockOhiService {
    constructor(
        public cacheService: CacheService,
        @InjectRepository(OhiCache)
        private readonly ohiCacheRepository: Repository<OhiCache>
    ) { }
    //#region Get Random
    getRandomInterger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getRandomFloat(min, max, decimal) {
        const random = Math.random() * (max - min) + min;
        const pow = Math.pow(10, decimal);
        return Math.floor(random * pow) / pow;
    }

    getRandomDate(start, end) {
        const date = new Date(+ start + Math.random() * (end - start));
        return date;
    }

    getRandomName(length): string {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    getRandomFirstName(): string {
        const array: string[] = ['Bauer', 'Margalett', 'Natalie', 'Cindy', 'Ethan', 'Jessica', 'Andrew', 'Katherine', 'Alizabeth', 'Wright'];
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomLastName(): string {
        const array: string[] = ['Keith', 'A.Ryan', 'Rivera', 'Peterson', 'Rodriguez', 'Djokovic', 'S.Stew', 'Moore', 'Wish', 'Adam', 'Rocky', 'Rehaan'];
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomMiddleName(): string {
        const array: string[] = ['Carlos', 'Thi', 'Carlos', 'Berd', 'Nylah ', 'Zeenat', 'Aaminah', 'Veronica', 'Vivien', 'Kaitlan', 'Liam'];
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomAvg(min, max) {
        const randomNumber = this.getRandomInterger(min, max).toString()
        //        const array: string[] = [randomNumber, randomNumber, randomNumber, null];
        const array: string[] = [randomNumber];
        return array[Math.floor(Math.random() * array.length)]
    }

    getRandomMedicine() {
        const array: string[] = ['Codeine', 'Citalopram', 'Alprazolam', 'Metformin', 'Viagra', 'Omeprazole', 'Hydrochlorothiazide', 'Lyrica', 'Loratadine', 'Gabapentin', 'Cyclobenzaprine', 'Ciprofloxacin'];
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomSideEffect() {
        // tslint:disable-next-line:no-unused-expression
        const array: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '1,2,3,4,5,6', '1,2,4,5', '2,4,5', '1,4,6', '3,5,6', '2,3,5', '4,5', '6'];
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomTakeRate() {
        const array: number[] = [null, null, null, this.getRandomInterger(0, 100), this.getRandomInterger(0, 100), 100, 100, 100, 100, 100, 100, 100];
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomDeleteFlag() {
        const array: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        return array[Math.floor(Math.random() * array.length)];
    }

    getAge(birthday) {
        const today = new Date();
        let age = today.getFullYear() - birthday.getFullYear();
        const m = today.getMonth() - birthday.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
            age--;
        }
        return age;
    }

    getPhoneNumber() {
        return Math.floor(Math.random() * 9000000000) + 1000000000;
    }
    /**
     * 
     * @param 
     */
    async getHAID(query: RequestHeartAdvisorUserId): Promise<any> {
        const strParams = [query.ehr_id || '', query.npi_id || '', query.mr_id || ''];
        // Get data from cache
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetHAID, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }
        const result = new Result({
            code: '0',
            message: ''
        });
        let data = [];
        for (let i = 1; i < 31; i++) {
            const A = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8m';
            const item = new HeartAdvisorUserID({
                ha_user_id: i < 10 ? A + 'B' + i : A + i,
                created_at: Math.round(this.getRandomDate(new Date(2020, 0, 1), new Date(2020, 0, 10)).getTime() / 1000),
                updated_at: Math.round(this.getRandomDate(new Date(2020, 0, 11), new Date(2020, 0, 30)).getTime() / 1000),
            });
            data.push(item);
        }
        if (query.ehr_id == '' && query.npi_id == '' && query.mr_id == '') {
            data = [];
        } else if (query.mr_id) {
            let arr1;
            if (query.mr_id.includes('-')) {
                arr1 = query.mr_id.split('-');
            } else {
                arr1 = [0, query.mr_id];
            }
            const index = +arr1[1] % 30;
            if (isNullOrUndefined(data[+index - 1])) {
                data = [];
            } else {
                data = [data[+index - 1]];
            }
        }
        const haids = new GetHeartAdvisorUserIdModel({
            result,
            data
        });
        await this.cacheService.SaveContentToCache(CacheKey.OhiGetHAID, JSON.stringify(haids), strParams);
        return await haids;
    }

    async getPersonalInfo(query: RequestGetPersonalInfo): Promise<any> {
        const strParams = [query.ha_user_id ? query.ha_user_id.toString() : ''];
        // Get data from cache
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetPersonalInfo, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }
        const result = new Result({ code: 0, message: 'OK' });
        const data = [];

        const haidList = []
        if (typeof (query.ha_user_id) === 'string') {
            haidList.push(query.ha_user_id);
        }
        else {
            for (let i = 0; i < query.ha_user_id.length; i++) {
                haidList.push(query.ha_user_id[i]);
            }
        }

        for (let i = 0; i < haidList.length; i++) {
            const birthday = this.getRandomDate(new Date(1950, 1, 1), new Date(2000, 11, 29));
            const person = new PatientInformation({
                mr_id: uuid.v4().substr(0, 7),
                ha_user_id: haidList[i],
                first_name: this.getRandomFirstName(),
                middle_name: this.getRandomMiddleName(),
                last_name: this.getRandomLastName(),
                gender: this.getRandomInterger(1, 3),
                age: this.getAge(birthday),
                phone_number: this.getPhoneNumber().toString(),
                birth: birthday,
                created_at: Math.round(this.getRandomDate(new Date(2020, 0, 1), new Date(2020, 0, 10)).getTime() / 1000),
                updated_at: Math.round(this.getRandomDate(new Date(2020, 0, 11), new Date(2020, 0, 30)).getTime() / 1000),
            });
            data.push(person);
        }

        if (data.length > 0) {
            const ok = new GetPersonalInfoModel({
                result, data
            });
            await this.cacheService.SaveContentToCache(CacheKey.OhiGetPersonalInfo, JSON.stringify(ok), strParams);
            return ok;
        }
        else {
            await this.cacheService.SaveContentToCache(CacheKey.OhiGetPersonalInfo, '', strParams);
            return null;
        }
    }


    // async getLatestWeightInfo(query): Promise<any> {
    //     const strParams = [query.ha_user_id ? query.ha_user_id.toString() : '', query.input_type ? query.input_type.toString() : ''];
    //     const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetLatestWeightInfo, strParams);
    //     if (str !== null) {
    //         return JSON.parse(str);
    //     }
    //     const result = new Result({ code: 0, message: '' });
    //     const data = [];

    //     const haidList = []
    //     // tslint:disable-next-line:prefer-for-of
    //     if (typeof (query.ha_user_id) === 'string') {
    //         haidList.push(query.ha_user_id);
    //     }
    //     else {
    //         // tslint:disable-next-line:prefer-for-of
    //         for (let i = 0; i < query.ha_user_id.length; i++) {
    //             haidList.push(query.ha_user_id[i]);
    //         }
    //     }

    //     for (let i = 0; i < haidList.length; i++) {
    //         const weight = this.getRandomFloat(40, 110, 1);
    //         const info = new PatientsVitalInformation({
    //             ha_user_id: haidList[i],
    //             date: Math.round(new Date(2020, 0, i + 1).getTime() / 1000),
    //             timezone: '+07:00',
    //             weight_kg: weight.toString(),
    //             weight_lbs: (weight * 2.20462).toFixed(1).toString(),
    //             bmi: this.getRandomFloat(25, 35, 1).toString(),
    //             input_type: this.getRandomInterger(1, 3),
    //             created_at: Math.round(this.getRandomDate(new Date(2020, 0, 10), new Date(2020, 0, 20)).getTime() / 1000),
    //             updated_at: Math.round(this.getRandomDate(new Date(2020, 0, 21), new Date(2020, 0, 30)).getTime() / 1000)
    //         });
    //         data.push(info);
    //     }


    //     if (data.length > 0) {
    //         const ok = new GetLatestWeightInfo({
    //             result, data
    //         });
    //         await this.cacheService.SaveContentToCache(CacheKey.OhiGetLatestWeightInfo, JSON.stringify(ok), strParams);
    //         return ok;
    //     }
    //     else {
    //         await this.cacheService.SaveContentToCache(CacheKey.OhiGetLatestWeightInfo, '', strParams);
    //         return null;
    //     }
    // }

    async getWeightInfo(query): Promise<any> {
        const strParams = [query.ha_user_id ? query.ha_user_id.toString() : ''];
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetWeightInfo, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }
        const result = new Result({ code: 0, message: '' });
        const data = [];

        const haidList = []
        // tslint:disable-next-line:prefer-for-of
        if (typeof (query.ha_user_id) === 'string') {
            haidList.push(query.ha_user_id);
        }
        else {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < query.ha_user_id.length; i++) {
                haidList.push(query.ha_user_id[i]);
            }
        }

        for (let i = 0; i < haidList.length; i++) {
            const weight = this.getRandomFloat(40, 110, 1);
            const beforeWeight = weight - this.getRandomFloat(0, 5, 1);
            const thresholdKg = this.getRandomFloat(0, 7, 1);
            const thresholdLbs = (thresholdKg * 2.20462).toFixed(1);
            const afterDay = new Date(+(new Date()) - Math.floor(Math.random() * 1000000000));
            const beforeDay = new Date(afterDay.getTime() - this.getRandomInterger(1, 7) * 24 * 60 * 60 * 1000);
            const weightAlert = Math.abs(weight - beforeWeight) > thresholdKg ? this.getRandomInterger(1, 3) : 0;
            const info = new PatientsVitalInformation({
                ha_user_id: haidList[i],
                latest_date: moment().unix() - 53200,
                latest_timezone: '+07:00',
                latest_weight_kg: weight.toString(),
                latest_weight_lbs: (weight * 2.20462).toFixed(1).toString(),
                weight_alert: weightAlert,
                last_weight_meas_date: moment().toISOString(),
                before_date: Math.round(beforeDay.getTime() / 1000),
                before_timezone: '+07:00',
                before_weight_kg: beforeWeight.toString(),
                before_weight_lbs: (beforeWeight * 2.20462).toFixed(1).toString(),
                after_date: Math.round(afterDay.getTime() / 1000),
                after_timezone: '+07:00',
                after_weight_kg: weight.toString(),
                after_weight_lbs: (weight * 2.20462).toFixed(1).toString(),
                threshold_kg: thresholdKg,
                threshold_lbs: thresholdLbs,
                threshold_period: this.getRandomInterger(1, 30),
                created_at: Math.round(this.getRandomDate(new Date(2020, 6, 10), new Date(2020, 6, 20)).getTime() / 1000),
                updated_at: Math.round(this.getRandomDate(new Date(2020, 6, 21), new Date(2020, 6, 30)).getTime() / 1000)
            });
            data.push(info);
        }

        if (data.length > 0) {
            const ok = new GetWeightInfo({
                result, data
            });
            await this.cacheService.SaveContentToCache(CacheKey.OhiGetWeightInfo, JSON.stringify(ok), strParams);
            return ok;
        }
        else {
            await this.cacheService.SaveContentToCache(CacheKey.OhiGetWeightInfo, '', strParams);
            return null;
        }
    }

    async getWeightThreshold(query): Promise<any> {
        const strParams = [query.ha_user_id ? query.ha_user_id.toString() : ''];
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetWeightThreshold, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }
        const result = new Result({ code: 0 });
        const threshold_info = [];

        const haidList = []
        // tslint:disable-next-line:prefer-for-of
        if (typeof (query.ha_user_id) === 'string') {
            haidList.push(query.ha_user_id);
        }
        else {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < query.ha_user_id.length; i++) {
                haidList.push(query.ha_user_id[i]);
            }
        }

        const thresholdData = [];
        const initData = [];
        for (let i = 0; i < 2; i++) {
            const thresoldItem = new ThresholdInformation({
                id: i + 1,
                enabled_flag: this.getRandomInterger(0, 2),
                threshold_kg: this.getRandomFloat(0, 10, 1).toString(),
                threshold_lbs: this.getRandomFloat(0, 20, 1).toString(),
                period: this.getRandomInterger(0, 31),
            });
            const initItem = new InitialThreshold({
                id: i + 1,
                enabled_flag: 0,
                threshold_kg: i === 0 ? '3' : '5',
                threshold_lbs: i === 0 ? '3' : '5',
                period: i === 0 ? '2' : '7',
            });
            thresholdData.push(thresoldItem);
            initData.push(initItem);
        }
        for (let i = 0; i < haidList.length; i++) {
            const info = new PatientsThresholdInformation({
                ha_user_id: haidList[i],
                threshold: thresholdData,
                init: initData,
                created_at: Math.round(this.getRandomDate(new Date(2020, 6, 10), new Date(2020, 6, 20)).getTime() / 1000),
                updated_at: Math.round(this.getRandomDate(new Date(2020, 6, 21), new Date(2020, 6, 30)).getTime() / 1000)
            });
            threshold_info.push(info);
        }

        if (threshold_info.length > 0) {
            const ok = new GetWeightThreshold({
                result, threshold_info
            });
            await this.cacheService.SaveContentToCache(CacheKey.OhiGetWeightThreshold, JSON.stringify(ok), strParams);
            return ok;
        }
        else {
            await this.cacheService.SaveContentToCache(CacheKey.OhiGetWeightThreshold, '', strParams);
            return null;
        }
    }

    async setWeightThreshold(body: RequestSetWeightThreshold): Promise<any> {
        const strParams = [body.ha_user_id ? body.ha_user_id.toString() : ''];
        let p = '';
        const result = new Result({ code: 0 });
        // each parameter | to distinguish
        strParams.forEach(element => {
            p = p + '|' + element;
        });

        const resultThreshold = await this.ohiCacheRepository.find({
            where: [{
                api_name: CacheKey.OhiGetWeightThreshold,
                parameters: p,
            }],
        });
        const initData = [];
        const threshold_info = [];
        const thresholdData = [];
        for (let i = 0; i < 2; i++) {
            const thresholdItem = new ThresholdInformation({
                id: i + 1,
                enabled_flag: body.threshold[i].enabled_flag,
                threshold_kg: body.threshold[i].unit === 1 ? body.threshold[i].value.toString() : (body.threshold[i].value * 0.453592).toString(),
                threshold_lbs: body.threshold[i].unit === 2 ? body.threshold[i].value.toString() : (body.threshold[i].value * 2.20462).toFixed(1).toString(),
                period: body.threshold[i].period,
            });
            const initItem = new InitialThreshold({
                id: i + 1,
                enabled_flag: 0,
                threshold_kg: i === 0 ? '3' : '5',
                threshold_lbs: i === 0 ? '3' : '5',
                period: i === 0 ? '2' : '7',
            });
            thresholdData.push(thresholdItem);
            initData.push(initItem);
        }
        const info = new PatientsThresholdInformation({
            ha_user_id: body.ha_user_id,
            threshold: thresholdData,
            init: initData,
            created_at: Math.round(this.getRandomDate(new Date(2020, 6, 10), new Date(2020, 6, 20)).getTime() / 1000),
            updated_at: Math.round(this.getRandomDate(new Date(2020, 6, 21), new Date(2020, 6, 30)).getTime() / 1000)
        });
        threshold_info.push(info);
        const ok = new GetWeightThreshold({
            result, threshold_info
        });
        const newWeightThreshold = new OhiCache();
        newWeightThreshold.id = resultThreshold[0].id;
        newWeightThreshold.api_name = CacheKey.OhiGetWeightThreshold;
        newWeightThreshold.parameters = p;
        newWeightThreshold.respone_data = JSON.stringify(ok);

        await this.ohiCacheRepository.save(newWeightThreshold);
        return result;
    }

    async getVitalData(query): Promise<any> {

        const strParams = [query.ha_user_id ? query.ha_user_id.toString() : '', query.type ? query.type.toString() : '',
        query.date_type ? query.date_type.toString() : '', query.start ? query.start.toString() : '',
        query.end ? query.end.toString() : '', query.input_type ? query.input_type.toString() : ''];
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetVitalData, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }
        const result = new Result({ code: 0, message: 'OK' });
        const dataBlood = [];
        const dataWeight = [];
        const startDate = moment(query.start, 'YYYY-MM-DDThh:mm:ss');
        const endDate = (query.end == null || query.end === '') ? moment() : moment(query.end, 'YYYY-MM-DDThh:mm:ss');
        const totalDate = (query.end === query.start) ? 0 : (endDate.diff(startDate, 'days'));
        if (totalDate >= 0) {
            for (let i = 0; i <= totalDate; i++) {
                const a = i > 0 ? -1 : 0;
                const date = endDate.add(a, 'day');
                const weight = this.getRandomFloat(40, 110, 4);
                const b = this.getRandomDate(startDate.toDate(), endDate.toDate());
                const c = this.getRandomDate(startDate.toDate(), endDate.toDate());
                const vitalInformationBlood = new VitalInformationBlood({
                    date: +date.unix() - 53200,
                    timezone: '+10:00',
                    sys: this.getRandomInterger(150, 200),
                    dia: this.getRandomInterger(90, 130),
                    pulse: this.getRandomInterger(80, 110),
                    ihb: this.getRandomInterger(0, 2),
                    cuff: this.getRandomInterger(0, 2),
                    body_movement: this.getRandomInterger(0, 2),
                    input_type: this.getRandomInterger(1, 4),
                    delete: this.getRandomDeleteFlag(),
                    created_at: Math.round(b.getTime() / 1000),
                    updated_at: +(date.unix())
                })
                const vitalInformationWeight = new VitalInformationWeight({
                    date: +(date.unix()) - 53200,
                    timezone: '+10:00',
                    weight_kg: weight.toString(),
                    weight_lbs: (weight * 2.20462).toFixed(4).toString(),
                    bmi: this.getRandomFloat(25, 35, 1).toString(),
                    input_type: this.getRandomInterger(1, 3),
                    delete: this.getRandomDeleteFlag(),
                    created_at: Math.round(b.getTime() / 1000),
                    updated_at: +(date.unix())
                });
                dataBlood.push(vitalInformationBlood);
                dataWeight.push(vitalInformationWeight);
            }
        }
        for (let i = 0; i <= 1; i++) {
            // const date = moment(startDate).date(i + 1);
            const data = new GetVitalDataModel({
                result,
                ha_user_id: query.ha_user_id,
                ha_request_at: Math.round(new Date().getTime() / 1000)  // + 86400,
            });
            if (query.type.toString() === '1') {
                data.vital_data = dataBlood;
            } else {
                data.vital_data = dataWeight;
            }
            if (data) {
                await this.cacheService.SaveContentToCache(CacheKey.OhiGetVitalData, JSON.stringify(data), strParams);
                return data;
            } else {
                return null;
            }
        }
    }

    async getVitalAverageData(query) {
        const strParams = [query.ha_user_id ? query.ha_user_id.toString() : '', query.start ? query.start.toString() : '',
        query.end ? query.end.toString() : '', query.count ? query.count.toString() : ''];
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetVitalAverageData, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }
        const result = new Result({ code: 0, message: 'OK' });
        const data = [];

        const startDate = (query.start == null || query.start === '') ? moment(new Date(), 'YYYY/MM/DD').add(-4, 'day') : moment(query.start, 'YYYY/MM/DD');
        const endDate = (query.end == null || query.end === '') ? moment() : moment(query.end, 'YYYY/MM/DD');
        const totalDate = (endDate.diff(startDate, 'days'));
        if (totalDate >= 0) {
            for (let i = 0; i <= totalDate; i++) {
                const a = i > 0 ? -1 : 0;
                const newdate = endDate.add(a, 'day');
                const data1 = new VitalDataAverage({
                    // date: date.toDate().setDate(((date.toDate().getDate()+1))),
                    date: moment(newdate).toISOString(), // format('YYYY-MM-DDThh:mm:ssZ'),
                    sys_avg_morning: this.getRandomAvg(115, 135),
                    sys_avg_evening: this.getRandomAvg(115, 135),
                    sys_avg_day: this.getRandomAvg(115, 135),
                    sys_avg_office: this.getRandomAvg(115, 135),
                    dia_avg_morning: this.getRandomAvg(75, 95),
                    dia_avg_evening: this.getRandomAvg(75, 95),
                    dia_avg_day: this.getRandomAvg(75, 95),
                    dia_avg_office: this.getRandomAvg(75, 95),
                    pulse_avg_morning: this.getRandomAvg(65, 75),
                    pulse_avg_evening: this.getRandomAvg(65, 75),
                    pulse_avg_day: this.getRandomAvg(65, 75),
                    pulse_avg_office: this.getRandomAvg(65, 75),
                    created_at: Math.round(this.getRandomDate(new Date(2020, 0, 1), new Date(2020, 0, 10)).getTime() / 1000),
                    updated_at: +(newdate.unix()),
                });
                data.push(data1);
            }
        }
        const dataResult = new GetVitalAverageData({
            result,
            ha_user_id: query.ha_user_id,
            vital_data: data,
        });
        if (!dataResult) {
            await this.cacheService.SaveContentToCache(CacheKey.OhiGetVitalAverageData, '', strParams);
            return null;
        }
        await this.cacheService.SaveContentToCache(CacheKey.OhiGetVitalAverageData, JSON.stringify(dataResult), strParams)
        return dataResult

    }

    async getPersonalBPInfo(query) {
        const strParams = [query.ha_user_id ? query.ha_user_id.toString() : ''];
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetPersonalBPInfo, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }
        const result = new Result({
            code: '0',
        });
        // tslint:disable-next-line:variable-name
        const bp_info = [];

        const haidList = []
        // tslint:disable-next-line:prefer-for-of
        if (typeof (query.ha_user_id) === 'string') {
            haidList.push(query.ha_user_id);
        }
        else {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < query.ha_user_id.length; i++) {
                haidList.push(query.ha_user_id[i]);
            }
        }

        for (let i = 0; i < haidList.length; i++) {
            const bloodpressure = new BloodpressureInfor({
                ha_user_id: haidList[i],
                goal_dia: this.getRandomInterger(80, 110),
                goal_sys: this.getRandomInterger(130, 160),
                dia_threshold: this.getRandomInterger(80, 110),
                sys_threshold: this.getRandomInterger(130, 160),
                created_at: Math.round(this.getRandomDate(new Date(2020, 0, 1), new Date(2020, 0, 10)).getTime() / 1000),
                updated_at: Math.round(this.getRandomDate(new Date(2020, 0, 11), new Date(2020, 0, 30)).getTime() / 1000),
            });
            bp_info.push(bloodpressure)
        }

        if (bp_info.length > 0) {
            const ok = new GetPersonalInfoModel({
                result, bp_info
            });
            await this.cacheService.SaveContentToCache(CacheKey.OhiGetPersonalBPInfo, JSON.stringify(ok), strParams);
            return ok;
        }
    }

    async setPersonalBPInfo(body) {

        const result = new Result({
            code: '0',
        });
        const strParams = [body.ha_user_id ? body.ha_user_id.toString() : ''];
        let p = '';
        // each parameter | to distinguish
        strParams.forEach(element => {
            p = p + '|' + element;
        });

        const resultBP = await this.ohiCacheRepository.find({
            where: [{
                api_name: CacheKey.OhiGetPersonalBPInfo,
                parameters: p,
            }],
        });
        const bp_info = [];
        const bloodpressure = new BloodpressureInfor({
            ha_user_id: body.ha_user_id,
            goal_dia: body.goal_dia,
            goal_sys: body.goal_sys,
            dia_threshold: body.threshold_dia,
            sys_threshold: body.threshold_sys,
            created_at: Math.round(this.getRandomDate(new Date(2020, 0, 1), new Date(2020, 0, 10)).getTime() / 1000),
            updated_at: Math.round(this.getRandomDate(new Date(2020, 0, 11), new Date(2020, 0, 30)).getTime() / 1000),
        });
        bp_info.push(bloodpressure)
        const setbp = new GetPersonalInfoModel({
            result, bp_info
        });
        const newBP = new OhiCache();
        newBP.id = resultBP[0].id;
        newBP.api_name = CacheKey.OhiGetPersonalBPInfo;
        newBP.parameters = p;
        newBP.respone_data = JSON.stringify(setbp);

        await this.ohiCacheRepository.save(newBP);
        const ok = new SetTargetBP({
            result
        });
        return ok;
    }

    async sendBPAlert(body: RequestBodySendBPAlert): Promise<any> {
        const result = new Result({
            code: 0,
            message: 'OK'
        });
        return new SentAlert(result);
    }

    async getPrescriptionInfo(query) {
        const strParams = [query.ha_user_id ? query.ha_user_id.toString() : '', query.start ? query.start.toString() : '',
        query.end ? query.end.toString() : ''];
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetPrescriptionInfo, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }

        const result = new Result({
            code: 0,
            message: 'OK'
        });
        const data = [];
        const startDate = (query.end == null || query.end === '') ? (moment(new Date(), 'YYYY/MM/DD').add(-15, 'day')) : (moment(query.start, 'YYYY/MM/DD'));
        const endDate = (query.end == null || query.end === '') ? moment() : (moment(query.end, 'YYYY/MM/DD'));
        // const totalDate = (endDate.diff(startDate, 'days'))
        for (let i = 0; i < 6; i++) {
            const a = this.getRandomDate(startDate.toDate(), endDate.toDate());
            const b = this.getRandomDate(startDate.toDate(), endDate.toDate());
            const c = this.getRandomDate(startDate.toDate(), endDate.toDate());
            const d = this.getRandomDate(startDate.toDate(), endDate.toDate());
            const item = new MedicinesInformation({
                medicine_id: i + 1,
                medicine_name: this.getRandomMedicine(),
                quantity: this.getRandomInterger(1, 5).toString(),
                units: 'mg',
                taking_start: a < b ? a : b,
                taking_end: a < b ? b : a,
                start: c < d ? c : d,
                end: c < d ? d : c,
                created_at: a < b ? Math.round(a.getTime() / 1000) : Math.round(b.getTime() / 1000),
                updated_at: a < b ? Math.round(b.getTime() / 1000) : Math.round(a.getTime() / 1000),
            });
            data.push(item);
        }
        const dataPresCriptionInfo = [];

        const data1 = new GetPrescriptionInfo({
            result: result,
            ha_user_id: query.ha_user_id,
            medicines: data
        });
        dataPresCriptionInfo.push(data1);

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < dataPresCriptionInfo.length; i++) {
            const ok = dataPresCriptionInfo[i];
            await this.cacheService.SaveContentToCache(CacheKey.OhiGetPrescriptionInfo, JSON.stringify(ok), strParams);
            return ok;
        }
    }

    async getTakingMedicineInfo(query): Promise<any> {
        const strParams = [query.ha_user_id ? query.ha_user_id.toString() : '', query.start ? query.start.toString() : '',
        query.end ? query.end.toString() : ''];
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetTakingMedicineInfo, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }
        const result = new Result({
            code: 0,
            message: 'OK'
        });
        const data = [];
        const dataTakingMedicineInfo = [];
        const startDate = (query.end == null || query.end === '') ? (moment(new Date(), 'YYYY/MM/DD').add(-15, 'day')) : (moment(query.start, 'YYYY/MM/DD')) //.add(1, 'day'));
        const endDate = (query.end == null || query.end === '') ? moment() : (moment(query.end, 'YYYY/MM/DD')) // .add(1, 'day'));
        const totalDate = (endDate.diff(startDate, 'days'));
        for (let i = 0; i <= totalDate; i++) {
            const a = i > 0 ? -1 : 0;
            const date = endDate.add(a, 'day');
            const takeDateInfo = new TakeDateInfo({
                take_date: moment(date).toISOString(), // format('YYYY-MM-DDThh:mm:ss'),
                take_rate: this.getRandomTakeRate(),
                created_at: Math.round(this.getRandomDate(new Date(2020, 0, 1), new Date(2020, 0, 10)).getTime() / 1000),
                updated_at: Math.round(this.getRandomDate(new Date(2020, 0, 11), new Date(2020, 0, 30)).getTime() / 1000),
            })
            data.push(takeDateInfo);
        }
        const takingMedicineInfo = new GetTakingMedicineInfo({});
        takingMedicineInfo.result = result;
        takingMedicineInfo.ha_user_id = query.ha_user_id;
        takingMedicineInfo.take_date_info = data;
        dataTakingMedicineInfo.push(takingMedicineInfo);

        await this.cacheService.SaveContentToCache(CacheKey.OhiGetTakingMedicineInfo, JSON.stringify(takingMedicineInfo), strParams);
        return takingMedicineInfo;
    }

    async getSideEffectInfo(query): Promise<any> {
        const strParams = [query.ha_user_id ? query.ha_user_id.toString() : '', query.start ? query.start.toString() : '',
        query.end ? query.end.toString() : ''];
        const str = await this.cacheService.GetContentFromCache(CacheKey.OhiGetSideEffectInfo, strParams);
        if (str !== null) {
            return JSON.parse(str);
        }
        const result = new Result({
            code: 0,
            message: 'OK'
        });
        const startDate = (query.end == null || query.end === '') ? (moment(new Date(), 'YYYY/MM/DD').add(-15, 'day')) : (moment(query.start, 'YYYY/MM/DD')) //.add(1, 'day'));
        const endDate = (query.end == null || query.end === '') ? moment() : (moment(query.end, 'YYYY/MM/DD')) // .add(1, 'day'));
        const totalDate = (endDate.diff(startDate, 'day'));
        // tslint:disable-next-line:variable-name
        const side_effect_infos = []
        for (let i = 0; i <= totalDate; i++) {
            const a = i > 0 ? -1 : 0;
            const date = endDate.add(a, 'day');
            const item1 = new InformationOnSideEffect({
                take_date: moment(date).toISOString(), // format('YYYY-MM-DDThh:mm:sssZ'),
                side_effects: this.getRandomSideEffect(),
                created_at: Math.round(this.getRandomDate(new Date(2020, 0, 1), new Date(2020, 0, 10)).getTime() / 1000),
                updated_at: Math.round(this.getRandomDate(new Date(2020, 0, 11), new Date(2020, 0, 30)).getTime() / 1000),
            })
            side_effect_infos.push(item1);
        };

        const sideEffectInfo = new GetSiteEffectInfo();
        sideEffectInfo.result = result;
        sideEffectInfo.ha_user_id = query.ha_user_id;
        sideEffectInfo.side_effect_info = side_effect_infos;
        const ok = sideEffectInfo;
        await this.cacheService.SaveContentToCache(CacheKey.OhiGetSideEffectInfo, JSON.stringify(ok), strParams);
        return ok;
    }
}
