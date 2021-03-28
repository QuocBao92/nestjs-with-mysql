import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { Problem } from '../common';
import { OhiService } from '../ohi/ohi.service';
import { PatientAggregate } from '../patients/entity/patient-aggregate.entity';
import { PatientContract } from '../patients/entity/patient-contract.entity';
import { RequestCommonDetailPatient } from '../patients/model/patient-model';
import { PatientCommonDetailService } from '../patients/patient-common-detail-service';

describe('ForesightService', () => {
    let service: PatientCommonDetailService;
    let patientContractRepository: Repository<PatientContract>;
    let patientRepository: Repository<PatientAggregate>;
    let ohiService: OhiService;

    class RepositoryMock {
        public findOne = jest.fn((p) => {
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3') {
                return null;
            }
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4') {
                throw Error();
            } else {
                return of(p);
            }
        });

        public findOneOrFail = jest.fn((p) => {
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5') {
                throw Error();
            } else {
                return of(p);
            }
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class OhiServiceMock {
        public getPersonalInfo = jest.fn((a, b) => {
            if (a.ha_user_id[0] === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6') {
                return new Problem();
            } else {
                return {
                    mr_id: '9bacd6f',
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    first_name: 'Alizabeth',
                    middle_name: 'Carlos',
                    last_name: 'Keith',
                    gender: 2,
                    age: 47,
                    birth: '1972-06-28T20:39:20.804Z',
                    created_at: 1578220772777,
                    updated_at: 1579172490065,
                };
            }
        });

        public getVitalAverageData = jest.fn((a, b) => {
            if (a.ha_user_id[0] === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB7') {
                return new Problem();
            } else {
                return {
                    result: { code: 0, message: 'OK' },
                    ha_user_id: [
                        'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    ],
                    vital_data: [
                        {
                            date: '2020-03-18T12:00:00',
                            sys_avg_morning: '132',
                            sys_avg_evening: null,
                            sys_avg_day: null,
                            sys_avg_office: '115',
                            dia_avg_morning: '78',
                            dia_avg_evening: '76',
                            dia_avg_day: '82',
                            dia_avg_office: null,
                            pulse_avg_morning: '68',
                            pulse_avg_evening: '70',
                            pulse_avg_day: '65',
                            pulse_avg_office: null,
                            created_at: 1577948930226,
                            updated_at: 1584514800000,
                        },
                        {
                            date: '2020-03-17T12:00:00',
                            sys_avg_morning: '124',
                            sys_avg_evening: '125',
                            sys_avg_day: null,
                            sys_avg_office: '119',
                            dia_avg_morning: '80',
                            dia_avg_evening: null,
                            dia_avg_day: null,
                            dia_avg_office: '86',
                            pulse_avg_morning: '70',
                            pulse_avg_evening: '72',
                            pulse_avg_day: '68',
                            pulse_avg_office: null,
                            created_at: 1578590608500,
                            updated_at: 1584428400000,
                        },
                        {
                            date: '2020-03-16T12:00:00',
                            sys_avg_morning: null,
                            sys_avg_evening: '120',
                            sys_avg_day: '125',
                            sys_avg_office: null,
                            dia_avg_morning: '94',
                            dia_avg_evening: '84',
                            dia_avg_day: '94',
                            dia_avg_office: '81',
                            pulse_avg_morning: '72',
                            pulse_avg_evening: '67',
                            pulse_avg_day: '73',
                            pulse_avg_office: '67',
                            created_at: 1578390377686,
                            updated_at: 1584342000000,
                        },
                        {
                            date: '2020-03-15T12:00:00',
                            sys_avg_morning: '122',
                            sys_avg_evening: '127',
                            sys_avg_day: '129',
                            sys_avg_office: null,
                            dia_avg_morning: '83',
                            dia_avg_evening: '75',
                            dia_avg_day: '90',
                            dia_avg_office: '81',
                            pulse_avg_morning: null,
                            pulse_avg_evening: '68',
                            pulse_avg_day: '73',
                            pulse_avg_office: '68',
                            created_at: 1578252519270,
                            updated_at: 1584255600000,
                        },
                        {
                            date: '2020-03-14T12:00:00',
                            sys_avg_morning: null,
                            sys_avg_evening: '122',
                            sys_avg_day: null,
                            sys_avg_office: '121',
                            dia_avg_morning: null,
                            dia_avg_evening: '85',
                            dia_avg_day: null,
                            dia_avg_office: '75',
                            pulse_avg_morning: '66',
                            pulse_avg_evening: '70',
                            pulse_avg_day: '67',
                            pulse_avg_office: '65',
                            created_at: 1578180976569,
                            updated_at: 1584169200000,
                        },
                        {
                            date: '2020-03-13T12:00:00',
                            sys_avg_morning: '132',
                            sys_avg_evening: '122',
                            sys_avg_day: '133',
                            sys_avg_office: '134',
                            dia_avg_morning: '91',
                            dia_avg_evening: '78',
                            dia_avg_day: '81',
                            dia_avg_office: '78',
                            pulse_avg_morning: null,
                            pulse_avg_evening: '71',
                            pulse_avg_day: '71',
                            pulse_avg_office: '72',
                            created_at: 1577939060265,
                            updated_at: 1584082800000,
                        },
                        {
                            date: '2020-03-12T12:00:00',
                            sys_avg_morning: null,
                            sys_avg_evening: '130',
                            sys_avg_day: '118',
                            sys_avg_office: null,
                            dia_avg_morning: null,
                            dia_avg_evening: '93',
                            dia_avg_day: '90',
                            dia_avg_office: null,
                            pulse_avg_morning: '70',
                            pulse_avg_evening: '72',
                            pulse_avg_day: '73',
                            pulse_avg_office: null,
                            created_at: 1578000131302,
                            updated_at: 1583996400000,
                        },
                    ],
                };
            }
        });

        public getPersonalBPInfo = jest.fn((a, b) => {
            if (a.ha_user_id[0] === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB8') {
                return new Problem();
            } else {
                return {
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    goal_dia: 88,
                    goal_sys: 148,
                    dia_threshold: 82,
                    sys_threshold: 149,
                    created_at: 1578025337065,
                    updated_at: 1579584232180,
                };
            }
        });
    }

    beforeEach(async () => {
        const mockRepository = jest.fn(() => ({
            metadata: {
                columns: [],
                relations: [],
            },
        }));
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PatientCommonDetailService,
                { provide: getRepositoryToken(PatientContract), useClass: RepositoryMock },
                { provide: getRepositoryToken(PatientAggregate), useClass: RepositoryMock },
                { provide: OhiService, useClass: OhiServiceMock },
            ],
        }).compile();

        service = module.get<PatientCommonDetailService>(PatientCommonDetailService);
        patientContractRepository = module.get<Repository<PatientContract>>(getRepositoryToken(PatientContract));
        patientRepository = module.get<Repository<PatientAggregate>>(getRepositoryToken(PatientAggregate));
        ohiService = module.get<OhiService>(OhiService);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Case No 1: getCommonDetail with no error', () => {
        it('Get Common Detail', async (done) => {
            const ReqCommonDetail = new RequestCommonDetailPatient({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                haids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
            });
            await service.getCommonDetail(ReqCommonDetail);
            done();
        });
    });

    describe('Case No 2: getCommonDetail with error HA-ID is not included in the session data', () => {
        it('Get Common Detail', (done) => {
            const ReqCommonDetail = new RequestCommonDetailPatient({
                haids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
            });
            service.getCommonDetail(ReqCommonDetail);
            done();
        });
    });

    describe('Case No 3: getCommonDetail with error patient contract not found', () => {
        it('Get Common Detail', (done) => {
            const ReqCommonDetail = new RequestCommonDetailPatient({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3',
                haids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
            });
            service.getCommonDetail(ReqCommonDetail);
            done();
        });
    });

    describe('Case No 4: getCommonDetail with error cannot connect database', () => {
        it('Get Common Detail', (done) => {
            const ReqCommonDetail = new RequestCommonDetailPatient({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                haids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
            });
            service.getCommonDetail(ReqCommonDetail);
            done();
        });
    });

    describe('Case No 5: getCommonDetail with error no patient total information in database', () => {
        it('Get Common Detail', (done) => {
            const ReqCommonDetail = new RequestCommonDetailPatient({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5',
                haids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
            });
            service.getCommonDetail(ReqCommonDetail);
            done();
        });
    });

    describe('Case No 6: getCommonDetail with error call ohi api getPersonalInfo return Problem', () => {
        it('Get Common Detail', async (done) => {
            const ReqCommonDetail = new RequestCommonDetailPatient({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6',
                haids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
            });
            await service.getCommonDetail(ReqCommonDetail);
            done();
        });
    });

    describe('Case No 7: getCommonDetail with error call ohi api getVitalAverageData return Problem', () => {
        it('Get Common Detail', async (done) => {
            const ReqCommonDetail = new RequestCommonDetailPatient({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB7',
                haids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
            });
            await service.getCommonDetail(ReqCommonDetail);
            done();
        });
    });

    describe('Case No 8: getCommonDetail with error call ohi api getPersonalBPInfo return Problem ', () => {
        it('Get Common Detail', async (done) => {
            const ReqCommonDetail = new RequestCommonDetailPatient({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB8',
                haids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
            });
            await service.getCommonDetail(ReqCommonDetail);
            done();
        });
    });

});
