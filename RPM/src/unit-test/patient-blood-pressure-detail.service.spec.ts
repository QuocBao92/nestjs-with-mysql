import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem, Requester } from '../common';
import { Logger } from '../common/cloudwatch-logs';
import { OhiService } from '../ohi/ohi.service';
import { PatientAggregateDaily } from '../patients/entity/patient-aggregate-daily.entity';
import { PatientContract } from '../patients/entity/patient-contract.entity';
import { RequestBloodPressureDetailService } from '../patients/model/patient-model/request-blood-pressure-detail-service-model';
import { PatientBloodPressureDetailService } from '../patients/patient-blood-pressure-detail.service';
import { SettingService } from '../setting/setting.service';

describe('PatientBloodPressureDetailService', () => {
    let service: PatientBloodPressureDetailService;
    let patientContractRepository: Repository<PatientContract>;
    let patientAggregateDailyRepository: Repository<PatientAggregateDaily>;
    let ohiService: OhiService;
    let settingService: SettingService;
    class RepositoryMock {
        public findOne = jest.fn((p) => {
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1') {
                return {
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    contract_weight: 0,
                    contract_application: 1,
                    delete_flag: 0,
                    ha_regist_date: '2020-01-05',
                };
            }
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB10') {
                return {
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    contract_weight: 0,
                    contract_application: 0,
                    delete_flag: 0,
                    ha_regist_date: '2020-01-05',
                };
            }
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2') {
                return null;
            }
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3') {
                throw Error();
            } else {
                return {
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    contract_weight: 0,
                    contract_application: 1,
                    delete_flag: 0,
                    ha_regist_date: '2020-01-05',
                };
            }
        });
        public find = jest.fn((p) => {
            if (p.where instanceof Function) {
                return [{
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    measurement_date: '2020-03-01',
                    rank_total: 4,
                    algo1: '',
                    algo2: '',
                    algo3: '',
                    algo4: '',
                    algo5: '',
                },
                {
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    measurement_date: '2020-03-02',
                    rank_total: 4,
                    algo1: '',
                    algo2: '',
                    algo3: '',
                    algo4: '',
                    algo5: '',
                },
                {
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    measurement_date: '2020-03-03',
                    rank_total: 1,
                    algo1: '',
                    algo2: '',
                    algo3: '',
                    algo4: '',
                    algo5: '',
                },
                {
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    measurement_date: '2020-03-04',
                    rank_total: 1,
                    algo1: '',
                    algo2: '',
                    algo3: '',
                    algo4: '',
                    algo5: '',
                },
                {
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    measurement_date: '2020-03-05',
                    rank_total: 2,
                    algo1: '',
                    algo2: '',
                    algo3: '',
                    algo4: '',
                    algo5: '',
                },
                ];
            }
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class OhiServiceMock {
        public getVitalData = jest.fn((a, b) => {
            // Test case 12: call Ohi getVitalData return Problem
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4') {
                return new Problem();
            } else {
                return {
                    result: { code: 0, message: 'OK' },
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9',
                    ha_request_at: 1584764641945,
                    vital_data: [
                        // 2020-05-03 : 07:59
                        {
                            date: 1583398861000,
                            timezone: '+07:00',
                            sys: 180,
                            dia: 112,
                            pulse: 89,
                            ihb: 0,
                            cuff: 0,
                            body_movement: 0,
                            input_type: 1,
                            delete: 0,
                            created_at: 1583440390880,
                            updated_at: 1583481599000,
                        },
                        // 2020-05-03 : 16:01
                        {
                            date: 1583369999000,
                            timezone: '+07:00',
                            sys: 180,
                            dia: 112,
                            pulse: 89,
                            ihb: 0,
                            cuff: 0,
                            body_movement: 0,
                            input_type: 3,
                            delete: 0,
                            created_at: 1583440390880,
                            updated_at: 1583481599000,
                        },
                        // 2020-05-03 : 03:01
                        {
                            date: 1583352061000,
                            timezone: '+07:00',
                            sys: 180,
                            dia: 112,
                            pulse: 89,
                            ihb: 0,
                            cuff: 0,
                            body_movement: 0,
                            input_type: 2,
                            delete: 0,
                            created_at: 1583440390880,
                            updated_at: 1583481599000,
                        },
                        // Evening
                        // 2020-03-04 15:03
                        {
                            date: 1583308861000,
                            timezone: '+07:00',
                            sys: 191,
                            dia: 98,
                            pulse: 102,
                            ihb: 1,
                            cuff: 0,
                            body_movement: 1,
                            input_type: 3,
                            delete: 0,
                            created_at: 1583206988766,
                            updated_at: 1583395199000,
                        },
                        {
                            date: 1583312461000,
                            timezone: '+07:00',
                            sys: 191,
                            dia: 98,
                            pulse: 102,
                            ihb: 0,
                            cuff: 0,
                            body_movement: 0,
                            input_type: 3,
                            delete: 1,
                            created_at: 1583206988766,
                            updated_at: 1583395199000,
                        },
                        {
                            date: 1583197199000,
                            timezone: '+07:00',
                            sys: 199,
                            dia: 121,
                            pulse: 89,
                            ihb: 0,
                            cuff: 1,
                            body_movement: 1,
                            input_type: 2,
                            delete: 0,
                            created_at: 1583050645416,
                            updated_at: 1583308799000,
                        },
                        {
                            date: 1583110799000,
                            timezone: '+07:00',
                            sys: 196,
                            dia: 121,
                            pulse: 81,
                            ihb: 1,
                            cuff: 0,
                            body_movement: 1,
                            input_type: 3,
                            delete: 0,
                            created_at: 1583140026911,
                            updated_at: 1583222399000,
                        },
                        // Evening
                        {
                            date: 1583049661000,
                            timezone: '+07:00',
                            sys: 199,
                            dia: 106,
                            pulse: 96,
                            ihb: 0,
                            cuff: 0,
                            body_movement: 0,
                            input_type: 3,
                            delete: 0,
                            created_at: 1583123076383,
                            updated_at: 1583135999000,
                        },
                        {
                            date: 1583053261000,
                            timezone: '+07:00',
                            sys: 199,
                            dia: 106,
                            pulse: 96,
                            ihb: 0,
                            cuff: 0,
                            body_movement: 1,
                            input_type: 3,
                            delete: 0,
                            created_at: 1583123076383,
                            updated_at: 1583135999000,
                        },
                    ],
                };
            }
        });

        public getSideEffectInfo = jest.fn((a, b) => {
            // Test case 15: call Ohi getSideEffectInfo return Problem
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6') {
                return new Problem();
            } else {
                return {
                    result: { code: 0, message: 'OK' },
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9',
                    side_effect_info: [
                        {
                            take_date: '2020-03-05T12:00:00',
                            side_effects: '2,4',
                            created_at: 1577924193775,
                            updated_at: 1579218477870,
                        },
                        {
                            take_date: '2020-03-04T12:00:00',
                            side_effects: '1,2,3',
                            created_at: 1578472024592,
                            updated_at: 1579406672088,
                        },
                        {
                            take_date: '2020-03-03T12:00:00',
                            side_effects: '',
                            created_at: 1578011116828,
                            updated_at: 1580168577040,
                        },
                        {
                            take_date: '2020-03-02T12:00:00',
                            side_effects: '',
                            created_at: 1578100019040,
                            updated_at: 1579906076039,
                        },
                        {
                            take_date: '2020-03-01T12:00:00',
                            side_effects: '',
                            created_at: 1578026643958,
                            updated_at: 1579188765371,
                        },
                    ],
                };
            }
        });

        public getTakingMedicineInfo = jest.fn((a, b) => {
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB7') {
                return new Problem();
            } else {
                return {
                    result: { code: 0, message: 'OK' },
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9',
                    take_date_info: [
                        {
                            take_date: '2020-03-05T12:00:00',
                            take_rate: 100,
                            created_at: 1578012384079,
                            updated_at: 1579218236406,
                        },
                        {
                            take_date: '2020-03-04T12:00:00',
                            take_rate: 100,
                            created_at: 1578283720499,
                            updated_at: 1579588856975,
                        },
                        {
                            take_date: '2020-03-03T12:00:00',
                            take_rate: null,
                            created_at: 1578121942678,
                            updated_at: 1579754292146,
                        },
                        {
                            take_date: '2020-03-02T12:00:00',
                            take_rate: 100,
                            created_at: 1578125399430,
                            updated_at: 1579531336051,
                        },
                        {
                            take_date: '2020-03-01T12:00:00',
                            take_rate: null,
                            created_at: 1578336531354,
                            updated_at: 1579082951392,
                        },
                    ],
                };
            }
        });

        public getVitalAverageData = jest.fn((a, b) => {
            // Test case 13 call Ohi getVitalAverageData return Problem
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5') {
                return new Problem();
            } else {
                return {
                    result: { code: 0, message: 'OK' },
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9',
                    vital_data: [
                        {
                            date: '2020-03-05T12:00:00',
                            sys_avg_morning: null,
                            sys_avg_evening: null,
                            sys_avg_day: '131',
                            sys_avg_office: '119',
                            dia_avg_morning: '88',
                            dia_avg_evening: '94',
                            dia_avg_day: '75',
                            dia_avg_office: null,
                            pulse_avg_morning: '65',
                            pulse_avg_evening: '67',
                            pulse_avg_day: null,
                            pulse_avg_office: '69',
                            created_at: 1578310283926,
                            updated_at: 1583395200000,
                        },
                        {
                            date: '2020-03-04T12:00:00',
                            sys_avg_morning: '119',
                            sys_avg_evening: '133',
                            sys_avg_day: '130',
                            sys_avg_office: '119',
                            dia_avg_morning: null,
                            dia_avg_evening: null,
                            dia_avg_day: '89',
                            dia_avg_office: '81',
                            pulse_avg_morning: null,
                            pulse_avg_evening: '65',
                            pulse_avg_day: '71',
                            pulse_avg_office: '73',
                            created_at: 1578176595358,
                            updated_at: 1583308800000,
                        },
                        {
                            date: '2020-03-03T12:00:00',
                            sys_avg_morning: '125',
                            sys_avg_evening: '134',
                            sys_avg_day: '133',
                            sys_avg_office: '125',
                            dia_avg_morning: null,
                            dia_avg_evening: null,
                            dia_avg_day: '81',
                            dia_avg_office: '90',
                            pulse_avg_morning: '70',
                            pulse_avg_evening: '65',
                            pulse_avg_day: null,
                            pulse_avg_office: null,
                            created_at: 1577997720087,
                            updated_at: 1583222400000,
                        },
                        {
                            date: '2020-03-02T12:00:00',
                            sys_avg_morning: '133',
                            sys_avg_evening: '124',
                            sys_avg_day: '122',
                            sys_avg_office: '116',
                            dia_avg_morning: '86',
                            dia_avg_evening: null,
                            dia_avg_day: null,
                            dia_avg_office: '94',
                            pulse_avg_morning: '68',
                            pulse_avg_evening: '67',
                            pulse_avg_day: '73',
                            pulse_avg_office: '74',
                            created_at: 1577868318109,
                            updated_at: 1583136000000,
                        },
                        {
                            date: '2020-03-01T12:00:00',
                            sys_avg_morning: '134',
                            sys_avg_evening: '116',
                            sys_avg_day: null,
                            sys_avg_office: null,
                            dia_avg_morning: '88',
                            dia_avg_evening: null,
                            dia_avg_day: '75',
                            dia_avg_office: '76',
                            pulse_avg_morning: '73',
                            pulse_avg_evening: '71',
                            pulse_avg_day: '73',
                            pulse_avg_office: '69',
                            created_at: 1578174372397,
                            updated_at: 1583049600000,
                        },
                    ],
                };
            }
        });

        public getPrescriptionInfo = jest.fn((a, b) => {
            // Test case 16 call Ohi getPrescriptionInfo return Problem
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB8') {
                return new Problem();
            } else {
                return {
                    result: { code: 0, message: 'OK' },
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9',
                    medicines: [
                        {
                            medicine_id: 1,
                            medicine_name: 'Codeine',
                            quantity: '3',
                            units: 'mg',
                            taking_start: '2020-03-02T06:48:47.251Z',
                            taking_end: '2020-03-04T10:18:27.507Z',
                            start: '2020-03-01T21:38:47.214Z',
                            end: '2020-03-02T13:21:28.325Z',
                            created_at: 1583131727251,
                            updated_at: 1583317107507,
                        },
                        {
                            medicine_id: 2,
                            medicine_name: 'Viagra',
                            quantity: '3',
                            units: 'mg',
                            taking_start: '2020-03-03T15:27:15.235Z',
                            taking_end: '2020-03-04T23:43:22.279Z',
                            start: '2020-03-03T03:11:37.770Z',
                            end: '2020-03-05T02:01:59.122Z',
                            created_at: 1583249235235,
                            updated_at: 1583365402279,
                        },
                        {
                            medicine_id: 3,
                            medicine_name: 'Alprazolam',
                            quantity: '4',
                            units: 'mg',
                            taking_start: '2020-03-02T08:50:10.401Z',
                            taking_end: '2020-03-04T19:34:12.829Z',
                            start: '2020-03-03T11:44:38.266Z',
                            end: '2020-03-04T03:00:27.308Z',
                            created_at: 1583139010401,
                            updated_at: 1583350452829,
                        },
                        {
                            medicine_id: 4,
                            medicine_name: 'Cyclobenzaprine',
                            quantity: '4',
                            units: 'mg',
                            taking_start: '2020-03-02T16:41:42.245Z',
                            taking_end: '2020-03-03T13:13:06.459Z',
                            start: '2020-03-03T09:04:47.338Z',
                            end: '2020-03-04T11:28:31.563Z',
                            created_at: 1583167302245,
                            updated_at: 1583241186459,
                        },
                        {
                            medicine_id: 5,
                            medicine_name: 'Hydrochlorothiazide',
                            quantity: '2',
                            units: 'mg',
                            taking_start: '2020-03-02T16:52:56.568Z',
                            taking_end: '2020-03-03T11:18:09.077Z',
                            start: '2020-03-01T19:23:14.539Z',
                            end: '2020-03-03T07:03:47.521Z',
                            created_at: 1583167976568,
                            updated_at: 1583234289077,
                        },
                        {
                            medicine_id: 6,
                            medicine_name: 'Alprazolam',
                            quantity: '1',
                            units: 'mg',
                            taking_start: '2020-03-05T02:51:49.275Z',
                            taking_end: '2020-03-05T02:54:06.514Z',
                            start: '2020-03-04T14:58:53.607Z',
                            end: '2020-03-05T05:43:17.862Z',
                            created_at: 1583376709275,
                            updated_at: 1583376846514,
                        },
                    ],
                };
            }
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

    // tslint:disable-next-line:max-classes-per-file
    class SettingServiceMock {
        public getValueByKeys = jest.fn((a) => {
            return [
                {
                    setting_key: 'doctor_dashboard_retry_interval',
                    setting_value: '1',
                },
                {
                    setting_key: 'doctor_dashboard_retry_times',
                    setting_value: '10',
                },
                {
                    setting_key: 'session_period',
                    setting_value: '30000000',
                },
                {
                    setting_key: 'token_period',
                    setting_value: '36000000',
                },
            ];
        });
        public getValueByKey = jest.fn((a) => {
            if (a === 'ohi_retry_interval') {
                return '1';
            }
            if (a === 'ohi_retry_times') {
                return '10';
            }
        });
    }
    // tslint:disable-next-line:max-classes-per-file
    beforeEach(async () => {
        process.env.OHI_HOST = 'http://192.168.1.116';
        const mockRepository = jest.fn(() => ({
            metadata: {
                columns: [],
                relations: [],
            },
        }));
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PatientBloodPressureDetailService,
                OhiService,
                Requester,
                Logger,
                { provide: SettingService, useClass: SettingServiceMock },
                { provide: getRepositoryToken(PatientContract), useClass: RepositoryMock },
                { provide: getRepositoryToken(PatientAggregateDaily), useClass: RepositoryMock },
                { provide: OhiService, useClass: OhiServiceMock },
                { provide: Logger, useClass: LoggerServiceMock },
            ],
        }).compile();

        service = module.get<PatientBloodPressureDetailService>(PatientBloodPressureDetailService);
        patientContractRepository = module.get<Repository<PatientContract>>(getRepositoryToken(PatientContract));
        patientAggregateDailyRepository = module.get<Repository<PatientAggregateDaily>>(getRepositoryToken(PatientAggregateDaily));
        ohiService = module.get<OhiService>(OhiService);
        settingService = module.get<SettingService>(SettingService);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    //#region Case No
    describe('Case No 1: bloodPressureDetail with no error', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 2:  bloodPressureDetail with error not HAID from session data', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 3:  bloodPressureDetail with error date_from not entered', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 4:  bloodPressureDetail with error date_from format is not a date', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                date_from: '2020!03!01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 5:  bloodPressureDetail with error a non-existent date is specified for date_from', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                date_from: '2020-03-41',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 6:  bloodPressureDetail with error date_to not entered', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                date_from: '2020-03-01',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 7:  bloodPressureDetail with error date_to format is not a date', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                date_from: '2020-03-01',
                date_to: '2020!03!17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 8:  bloodPressureDetail with error a non-existent date is specified for date_to', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                date_from: '2020-03-01',
                date_to: '2020-03-47',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 9:  bloodPressureDetail with error date_from bigger date_to', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                date_from: '2020-03-21',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 10:  bloodPressureDetail with error not found patient contract in database', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 11:  bloodPressureDetail with error cannot connect patientContract table in database', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3',
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 12:  bloodPressureDetail with error call api getVitalData from OHI failed', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 13:  bloodPressureDetail with error call api getVitalAverageData from OHI failed', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5',
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 14:  bloodPressureDetail with error call api getSideEffectInfo from OHI failed', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6',
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 15:  bloodPressureDetail with error call api getTakingMedicineInfo from OHI failed', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB7',
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 16:  bloodPressureDetail with error call api getPrescriptionInfo from OHI failed', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB8',
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });

    describe('Case No 17:  bloodPressureDetail with haid no contract application', () => {
        it('Blood Pressure Detail', async (done) => {
            const reqBlooddetail = new RequestBloodPressureDetailService({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB10',
                date_from: '2020-03-01',
                date_to: '2020-03-17',
            });
            await service.getbloodPressureDetail(reqBlooddetail);
            done();
        });
    });
    //#endregion

});
