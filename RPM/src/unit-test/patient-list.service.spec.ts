import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { Problem, ProblemException } from '../common';
import { OhiService } from '../ohi/ohi.service';
import { PatientListService } from '../patients/patient-list.service';
import { PatientContract } from '../patients/entity/patient-contract.entity';
import { PatientAggregate } from '../patients/entity/patient-aggregate.entity';
import { RequestPatientListService } from '../patients/model/patient-model';

describe('PatientListService', () => {
    let service: PatientListService;
    let ohiService: OhiService;
    let patientContractRepository: Repository<PatientContract>;
    let patientAggregateRepository: Repository<PatientAggregate>;

    class PatientContractRepositoryMock {
        public find = jest.fn((res) => {
            if (res.where[0].ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4') {
                throw Error();
            }

            if (res.where[0].ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC1') {
                return [
                    {
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB8',
                        contract_weight: 0,
                        contract_application: 1,
                        delete_flag: 0,
                        ha_regist_date: '2020-01-05',
                        regist_date: '2020-02-25T19:04:34.000Z',
                        update_date: '2020-03-17T14:06:23.000Z',
                    },
                    {
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9',
                        contract_weight: 0,
                        contract_application: 1,
                        delete_flag: 0,
                        ha_regist_date: '2020-01-05',
                        regist_date: '2020-02-25T19:04:35.000Z',
                        update_date: '2020-03-17T14:06:23.000Z',
                    },
                ];
            }

            if (res.where[0].ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC2') {
                return [
                    {
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC2',
                        contract_weight: 0,
                        contract_application: 0,
                        delete_flag: 0,
                        ha_regist_date: '2020-01-05',
                        regist_date: '2020-02-25T19:04:34.000Z',
                        update_date: '2020-03-17T14:06:23.000Z',
                    },
                    {
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9',
                        contract_weight: 0,
                        contract_application: 1,
                        delete_flag: 0,
                        ha_regist_date: '2020-01-05',
                        regist_date: '2020-02-25T19:04:35.000Z',
                        update_date: '2020-03-17T14:06:23.000Z',
                    },
                ];
            }

            return of(res);
        });
    }

    // tslint:disable-next-line: max-classes-per-file
    class PatientAggregateRepositoryMock {
        public save = jest.fn((p) => {
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2') {
                throw new ProblemException();
            } else {
                return of(p);
            }
        });

        public find = jest.fn((res) => {
            if (res.where[0].ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3') {
                throw Error();
            }

            if (res.where[0].ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC1') {
                return [
                    {
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC1',
                        last_aggregate_date: '2020-03-20',
                        ha_request_timestamp: '1582628491107',
                        last_meas_date: '2020-03-19',
                        day_sys_latest: 121,
                        day_dia_latest: 85,
                        day_pulse_latest: 71,
                        target_sys: 141,
                        target_dia: 95,
                        threshold_sys: 153,
                        threshold_dia: 82,
                        threshold_excess_num: 7,
                        meas_num: 7,
                        algo_alert: 0,
                        ihb_rate: 57,
                        side_effect_rate: 100,
                        rank_total: 4,
                        rank_sys: 1,
                        rank_dia: 4,
                        rank_pulse: 1,
                        rank_excess_rate: 4,
                        rank_ihb_rate: 4,
                        rank_side_effect_rate: 4,
                        point_sys: '0.5',
                        point_dia: '2.0',
                        point_pulse: '0.0',
                        point_excess_rate: '2.9',
                        point_ihb_rate: '2.9',
                        point_side_effect_rate: '2.9',
                        regist_date: '2020-02-26T11:27:15.000Z',
                        update_date: '2020-03-19T12:41:23.000Z',
                    },
                    {
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9',
                        last_aggregate_date: '2020-03-20',
                        ha_request_timestamp: '1583107200000',
                        last_meas_date: '2020-03-19',
                        day_sys_latest: 127,
                        day_dia_latest: 82,
                        day_pulse_latest: 70,
                        target_sys: 130,
                        target_dia: 109,
                        threshold_sys: 132,
                        threshold_dia: 108,
                        threshold_excess_num: 5,
                        meas_num: 5,
                        algo_alert: 0,
                        ihb_rate: 100,
                        side_effect_rate: 100,
                        rank_total: 1,
                        rank_sys: 1,
                        rank_dia: 1,
                        rank_pulse: 1,
                        rank_excess_rate: 4,
                        rank_ihb_rate: 4,
                        rank_side_effect_rate: 4,
                        point_sys: '0.9',
                        point_dia: '0.5',
                        point_pulse: '0.0',
                        point_excess_rate: '2.9',
                        point_ihb_rate: '2.9',
                        point_side_effect_rate: '2.9',
                        regist_date: '2020-02-26T11:27:15.000Z',
                        update_date: '2020-03-19T12:41:23.000Z',
                    },
                ];
            }

            if (res.where[0].ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC2') {
                return [
                    {
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC2',
                        last_aggregate_date: '2020-03-20',
                        ha_request_timestamp: '1582628491107',
                        last_meas_date: '2020-03-19',
                        day_sys_latest: 121,
                        day_dia_latest: 85,
                        day_pulse_latest: 71,
                        target_sys: 141,
                        target_dia: 95,
                        threshold_sys: 153,
                        threshold_dia: 82,
                        threshold_excess_num: 7,
                        meas_num: 7,
                        algo_alert: 1,
                        ihb_rate: 57,
                        side_effect_rate: 100,
                        rank_total: 4,
                        rank_sys: 1,
                        rank_dia: 4,
                        rank_pulse: 1,
                        rank_excess_rate: 4,
                        rank_ihb_rate: 4,
                        rank_side_effect_rate: 4,
                        point_sys: '0.5',
                        point_dia: '2.0',
                        point_pulse: '0.0',
                        point_excess_rate: '2.9',
                        point_ihb_rate: '2.9',
                        point_side_effect_rate: '2.9',
                        regist_date: '2020-02-26T11:27:15.000Z',
                        update_date: '2020-03-19T12:41:23.000Z',
                    },
                    {
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9',
                        last_aggregate_date: '2020-03-20',
                        ha_request_timestamp: '1583107200000',
                        last_meas_date: '2020-03-19',
                        day_sys_latest: 127,
                        day_dia_latest: 82,
                        day_pulse_latest: 70,
                        target_sys: 130,
                        target_dia: 109,
                        threshold_sys: 132,
                        threshold_dia: 108,
                        threshold_excess_num: 5,
                        meas_num: 5,
                        algo_alert: 0,
                        ihb_rate: 100,
                        side_effect_rate: 100,
                        rank_total: 4,
                        rank_sys: 1,
                        rank_dia: 1,
                        rank_pulse: 1,
                        rank_excess_rate: 4,
                        rank_ihb_rate: 4,
                        rank_side_effect_rate: 4,
                        point_sys: '0.9',
                        point_dia: '0.5',
                        point_pulse: '0.0',
                        point_excess_rate: '2.9',
                        point_ihb_rate: '2.9',
                        point_side_effect_rate: '2.9',
                        regist_date: '2020-02-26T11:27:15.000Z',
                        update_date: '2020-03-19T12:41:23.000Z',
                    },
                ];
            }

            return of(res);
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class OhiServiceMock {
        public getPersonalInfo = jest.fn((param1, param2) => {
            if (param1.ha_user_id[0] === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6') {
                return new Problem();
            }

            if (param1.ha_user_id[0] === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC1') {
                return {
                    result: { code: 0, message: 'OK' },
                    data: [
                      {
                        mr_id: 'a75b9d1',
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC1',
                        first_name: 'Margalett',
                        middle_name: 'Vivien',
                        last_name: 'Peterson',
                        gender: 2,
                        age: 69,
                        birth: '1951-01-23T20:35:09.643Z',
                        created_at: 1577911220518,
                        updated_at: 1579296652428,
                      },
                      {
                        mr_id: 'a75b9d1',
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                        first_name: 'Margalett',
                        middle_name: 'Vivien',
                        last_name: 'Peterson',
                        gender: 2,
                        age: 69,
                        birth: '1951-01-23T20:35:09.643Z',
                        created_at: 1577911220518,
                        updated_at: 1579296652428,
                      },
                    ],
                };
            }

            if (param1.ha_user_id[0] === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC2') {
                return {
                    result: { code: 0, message: 'OK' },
                    data: [
                      {
                        mr_id: 'a75b9d1',
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC2',
                        first_name: 'Margalett',
                        middle_name: 'Vivien',
                        last_name: 'Peterson',
                        gender: 2,
                        age: 69,
                        birth: '1951-01-23T20:35:09.643Z',
                        created_at: 1577911220518,
                        updated_at: 1579296652428,
                      },
                      {
                        mr_id: 'a75b9d1',
                        ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                        first_name: 'Margalett',
                        middle_name: 'Vivien',
                        last_name: 'Peterson',
                        gender: 2,
                        age: 69,
                        birth: '1951-01-23T20:35:09.643Z',
                        created_at: 1577911220518,
                        updated_at: 1579296652428,
                      },
                    ],
                };
            }

            return true;
        });
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PatientListService,
                { provide: OhiService, useClass: OhiServiceMock },
                { provide: getRepositoryToken(PatientContract), useClass: PatientContractRepositoryMock },
                { provide: getRepositoryToken(PatientAggregate), useClass: PatientAggregateRepositoryMock },
            ],
        }).compile();

        service = module.get<PatientListService>(PatientListService);
        ohiService = module.get<OhiService>(OhiService);
        patientContractRepository = module.get<Repository<PatientContract>>(getRepositoryToken(PatientContract));
        patientAggregateRepository = module.get<Repository<PatientAggregate>>(getRepositoryToken(PatientAggregate));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Case No 1 Test getPatientList the HA - ID list is not included in the session data', () => {
        it('It should return an empty array', (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 1,
                // ha_user_id: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
                page_type: 1,
            });
            service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 2 Test getPatientList field "type" of request object is not a number', () => {
        it('It should return an instance of ProblemException', (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 'g',
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
                page_type: 1,
            });
            service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 3 Test getPatientList error when field "type" of request object other than 1 and 2', () => {
        it('It should return an instance of ProblemException', (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 3,
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
                page_type: 1,
            });
            service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 4 Test getPatientList when getting vitalDatas occurred a problem', () => {
        it('It should return ProblemException.API_InternalServerError()', (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 1,
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3'],
                page_type: 1,
            });
            service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 5 Test getPatientList when getting patientContracts occurred a problem', () => {
        it('It should return ProblemException.API_InternalServerError()', (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 1,
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4'],
                page_type: 1,
            });
            service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 6 Test getPatientList when field "type" of request object is 1', () => {
        it('It should call and return function getBloodPressure succesfully', async (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 1,
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5'],
                page_type: 1,
            });
            await service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 7 Test getBloodPressure when getting personal info from OHI occurred an error', () => {
        it('It should return an error when getting personal info from OHI', async (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 1,
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6'],
                page_type: 1,
            });
            await service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 8 Test getBloodPressure when cannot find patientContract by ha_user_id from patientContracts', () => {
        it('PatientContract should not exist then omit the item', async (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 1,
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC1'],
                page_type: 1,
            });
            await service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 9 Test getBloodPressure when succesfully', () => {
        it('It should return new PatientList', async (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 1,
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mC2'],
                page_type: 1,
            });
            await service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 10 Test getPatientList when field "page_type" of request object is 1', () => {
        it('It should call and return function getBloodPressure succesfully', async (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 2,
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6'],
                page_type: 1,
            });
            await service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 11 Test getPatientList when both fields "page_type" and "type" of request object are different from 1', () => {
        it('It should call and return function getBloodPressure succesfully', async (done) => {
            const requestPatientListService = new RequestPatientListService({
                type: 2,
                ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB7'],
                page_type: 2,
            });
            await service.getPatientList(requestPatientListService);
            done();
        });
    });

    describe('Case No 12 Test sortArr when both params1 and params2 are undefined', () => {
        it('It should return 0', (done) => {
            service.sortArr(undefined, undefined);
            done();
        });
    });

    describe('Case No 13 Test sortArr when params1 is undefined', () => {
        it('It should return -1', (done) => {
            service.sortArr(undefined, 3);
            done();
        });
    });

    describe('Case No 14 Test sortArr when params2 is undefined', () => {
        it('It should return 1', (done) => {
            service.sortArr(3, undefined);
            done();
        });
    });

    describe('Case No 15 Test sortArr when params1 equal to params2', () => {
        it('It should return 0', (done) => {
            service.sortArr(3, 3);
            done();
        });
    });

    describe('Case No 16 Test sortArr when params1 greater than params2', () => {
        it('It should return 1', (done) => {
            service.sortArr(4, 3);
            done();
        });
    });
});
