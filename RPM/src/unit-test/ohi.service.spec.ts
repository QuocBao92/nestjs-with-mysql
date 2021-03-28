import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from '../setting/setting.service';
import { Logger, EntryName } from '../common/cloudwatch-logs';
import {
    RequestHeartAdvisorUserId, RequestGetPersonalInfo,
    RequestLatestWeightInfo, RequestGetVitalData, RequestGetVitalAverageData,
    RequestPrescriptionInfo, RequestGetTakingMedicineInfo, RequestSideEffectInfo,
    RequestBodyGetPersonalBPInfo, RequestBodySetPersonalBPInfo, RequestBodySendBPAlert,
    RequestGetReferenceInfo,
} from '../ohi/models/request-model';
import { OhiService } from '../ohi/ohi.service';
import { Requester } from '../common';
import { ConfigService } from 'aws-sdk';

describe('OhiService', () => {

    let service: OhiService;
    let settingService: SettingService;
    let logger: Logger;
    let requester: Requester;

    // tslint:disable-next-line:max-classes-per-file
    class SettingServiceMock {
        public getValueByKey = jest.fn((a) => {
            throw Error;
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class LoggerServiceMock {
        public debug = jest.fn();
        public fatal = jest.fn();
        public error = jest.fn();
        public warn = jest.fn();
        public info = jest.fn();
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OhiService,
                { provide: SettingService, useClass: SettingServiceMock },
                { provide: Logger, useClass: LoggerServiceMock },
                { provide: Requester, useClass: Requester },
                { provide: ConfigService, useClass: ConfigService },
            ],
        }).compile();

        service = module.get<OhiService>(OhiService);
        logger = module.get<Logger>(Logger);
        settingService = module.get<SettingService>(SettingService);
        requester = module.get<Requester>(Requester);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Case No 1: Test retryGetData with error', () => {
        it('Test retryGetData', async (done) => {
            const url = 'url call OHI';
            const apiName = 'api';
            const entryName: EntryName = EntryName.ApiGetHAID;
            service.retryGetData(url, apiName, entryName);
            done();
        });
    });

    describe('Case No 2: Test getHAID', () => {
        it('Test getHAID', async (done) => {
            const query = new RequestHeartAdvisorUserId({
                ehr_id: '1',
                mr_id: '1',
                npi_id: '1',
            });
            const entryName: EntryName = EntryName.ApiGetHAID;
            await service.getHAID(query, entryName);
            done();
        });
    });

    describe('Case No 3: Test getPersonalInfo', () => {
        it('Test getPersonalInfo', async (done) => {
            const query = new RequestGetPersonalInfo({
                ha_user_id: ['1'],
            });
            await service.getPersonalInfo(query, EntryName.ApiGetPersonalInfo);
            done();
        });
    });

    describe('Case No 4: Test getLatestWeightInfo', () => {
        it('Test getLatestWeightInfo', async (done) => {
            const query = new RequestLatestWeightInfo({
                input_type: 1,
                ha_user_id: ['1'],
            });
            await service.getLatestWeightInfo(query, EntryName.ApiGetLatestWeightInfo);
            done();
        });
    });

    describe('Case No 5: Test getVitalData', () => {
        it('Test getVitalData', async (done) => {
            const query = new RequestGetVitalData({
                type: 1,
                input_type: 1,
                date_type: 1,
            });
            await service.getVitalData(query, EntryName.ApiGetVitalData);
            done();
        });
    });

    describe('Case No 6: Test getVitalAverageData', () => {
        it('Test getVitalAverageData', async (done) => {
            const query = new RequestGetVitalAverageData({
                count: 1,
            });
            await service.getVitalAverageData(query, EntryName.ApiGetVitalAverageData);
            done();
        });
    });

    describe('Case No 7: Test getPrescriptionInfo', () => {
        it('Test getPrescriptionInfo', async (done) => {
            const query = new RequestPrescriptionInfo({
                count: 1,
            });
            await service.getPrescriptionInfo(query, EntryName.ApiGetPrescriptionInfo);
            done();
        });
    });

    describe('Case No 8: Test getTakingMedicineInfo', () => {
        it('Test getTakingMedicineInfo', async (done) => {
            const query = new RequestGetTakingMedicineInfo({
                count: 1,
            });
            await service.getTakingMedicineInfo(query, EntryName.ApiGetTakingMedicineInfo);
            done();
        });
    });

    describe('Case No 9: Test getSideEffectInfo', () => {
        it('Test getSideEffectInfo', async (done) => {
            const query = new RequestSideEffectInfo({
                count: 1,
            });
            await service.getSideEffectInfo(query, EntryName.ApiGetSideEffectInfo);
            done();
        });
    });

    describe('Case No 10: Test getPersonalBPInfo', () => {
        it('Test getPersonalBPInfo', async (done) => {
            const query = new RequestBodyGetPersonalBPInfo({
                ha_user_id: ['1'],
            });
            await service.getPersonalBPInfo(query, EntryName.ApiGetPersonalBPInfo);
            done();
        });
    });

    describe('Case No 11: Test setPersonalBPInfo', () => {
        it('Test setPersonalBPInfo', async (done) => {
            const query = new RequestBodySetPersonalBPInfo({
                ha_user_id: '1',
                goal_sys: 120,
                goal_dia: 110,
                threshold_sys: 120,
                threshold_dia: 110,
            });
            await service.setPersonalBPInfo(query, EntryName.ApiSetPersonalBPInfo);
            done();
        });
    });

    describe('Case No 12: Test sendBPAlert', () => {
        it('Test sendBPAlert', async (done) => {
            const query = new RequestBodySendBPAlert({
                ha_user_id: '1',
                sys_threshold: 120,
                dia_threshold: 110,
                sys_average: 110,
                dia_average: 100,
                date: 1579188365,
            });
            await service.sendBPAlert(query, EntryName.ApiSendBPAlert);
            done();
        });
    });

    describe('Case No 13: Test getReferenceInfo', () => {
        it('Test getReferenceInfo', async (done) => {
            const query = new RequestGetReferenceInfo({
                ha_user_id: '1',
            });
            await service.getReferenceInfo(query, EntryName.ApiGetReferenceInfo);
            done();
        });
    });
});
