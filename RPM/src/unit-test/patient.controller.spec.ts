/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { ClassificationCode, CodeType, MessageType, ProblemException, Requester } from '../common';
import { Logger } from '../common/cloudwatch-logs';
import { OhiService } from '../ohi/ohi.service';
import { ConfirmSessionService } from '../patients/confirm-session.service';
import { RequestBloodPressureDetail } from '../patients/model/request-model/request-blood-pressure-detail';
import { RequestConfirmSessionId } from '../patients/model/request-model/request-confirm-session-id';
import { RequestPatientList } from '../patients/model/request-model/request-patient-list';
import { RequestSetPersonalBloodPressure } from '../patients/model/request-model/request-set-personal-blood-pressure';
import { RequestUpdateHaid } from '../patients/model/request-model/request-update-haid';
import { PatientBloodPressureDetailService } from '../patients/patient-blood-pressure-detail.service';
import { PatientCommonDetailService } from '../patients/patient-common-detail-service';
import { PatientListService } from '../patients/patient-list.service';
import { PatientPersonalBpService } from '../patients/patient-personal-blood-pressure.service';
import { PatientController } from '../patients/patient.controller';
import { UpdateHaidService } from '../patients/update-haid.service';
import { SettingService } from '../setting/setting.service';
import { TableSession } from '../sso/entity/table_session.entity';
import { SsoService } from '../sso/sso.service';
describe('PatientController', () => {
    let controller: PatientController;
    let patientCommonService: PatientCommonDetailService;
    let patientBloodPressureDetailService: PatientBloodPressureDetailService;
    let patientListService: PatientListService;
    let patientPersonalBpService: PatientPersonalBpService;
    let updateHaidService: UpdateHaidService;
    let logger: Logger;
    let confirmSessionService: ConfirmSessionService;
    let sessionRepository: Repository<TableSession>;

    class LoggerServiceMock {
        public debug = jest.fn();
        public fatal = jest.fn();
        public error = jest.fn();
        public warn = jest.fn();
        public info = jest.fn();
    }

    // tslint:disable-next-line:max-classes-per-file
    class ErrorCodeMock {
        public generateResult = jest.fn((a, b) => {
            return true;
        });
    }
    // tslint:disable-next-line:max-classes-per-file
    class PatientCommonServiceMock {
        public getCommonDetail = jest.fn((a) => {
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1') {
                return new ProblemException({
                    status: HttpStatus.BAD_REQUEST,
                    code: CodeType.AtTheError,
                    classificationCode: ClassificationCode.IsNotFound,
                    messageType: MessageType.IsNotFound,
                });
            } else {
                return {
                    result:
                    {
                        code: '0',
                    },
                    mr_id: '9007895',
                    first_name: 'Jessica',
                    middle_name: 'Veronica',
                    last_name: 'Wish',
                    gender: 2,
                    birthday: '1998-03-24',
                    age: 22,
                    morning_sys_latest: 124,
                    morning_dia_latest: 84,
                    morning_pulse_latest: 68,
                    evening_sys_latest: 124,
                    evening_dia_latest: 87,
                    evening_pulse_latest: 69,
                    sys_threshold: 134,
                    dia_threshold: 92,
                    sys_target: 149,
                    dia_target: 93,
                    weight_alert: 0,
                    rank_total: 1,
                    bot: 0,
                    list_back: 0,
                    ha_regist_date: '2020-01-15',
                };
            }
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class PatientBloodPressureDetailServiceMock {
        public getbloodPressureDetail = jest.fn((a) => {
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1') {
                return new ProblemException();
            } else {
                return of(a);
            }
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class PatientListServiceMock {
        public getPatientList = jest.fn((a) => {
            if (a.type === 1) {
                return new ProblemException();
            } else {
                return of(a);
            }
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class PatientPersonalBpServiceMock {
        public getPersonalBloodPressure = jest.fn((a) => {
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1') {
                return new ProblemException();
            } else {
                return of(a);
            }
        });

        public setPersonalBloodPressure = jest.fn((a) => {
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1') {
                return new ProblemException();
                // return new ProblemException({
                //     status: HttpStatus.NOT_FOUND,
                //     code: CodeType.AtTheError,
                //     classificationCode: ClassificationCode.IsNotFound,
                //     messageType: MessageType.IsNotFound,
                // });
            } else {
                return of(a);
            }
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class UpdateHaidServiceMock {
        public updateHaid = jest.fn((a, b) => {
            if (b.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1') {
                return new ProblemException();
            } else {
                return true;
            }
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class ConfirmSessionServiceMock {
        public confirmSession = jest.fn((a) => {
            if (a.sessionId === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1') {
                return new ProblemException();
            } else {
                return true;
            }
        });
    }

    // tslint:disable-next-line:max-classes-per-file
    class SettingServiceMock {
        public getValueByKey = jest.fn((a) => {
            return '[{"setting_id":1,"enabled_flag":0,"threshold_value":3,"threshold_unit":2,"period":2},{"setting_id":2,"enabled_flag":0,"threshold_value":5,"threshold_unit":2,"period":7}]';
        });
    }
    // tslint:disable-next-line:max-classes-per-file
    class RepositoryMock {
        public save = jest.fn((a) => of(a));
        public findOneOrFail = jest.fn((a) => {
            if (a.where.access_token === 'a9607e11901a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994fee') {
                return null;
            } else if (a.where.access_token === '12307e11901a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123') {
                throw Error();
            } else if (a.where.access_token === '45678911901a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123') {
                return { exp_date: '10000000' };
            } else if (a.where.access_token === '1111111111a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123') {
                return {
                    exp_date: '3744170996287',
                    login_data: {
                        ehr_id: 'e167267c-16c9-4fe3-96ae-9cff5703e90a',
                        npi_id: '4236464757', mr_id: '0000000001',
                        ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB7', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB8', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9'],
                        current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9', page_type: 1,
                    },
                };
            } else if (a.where.access_token === '22222222222a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123') {
                return {
                    exp_date: '3744170996287',
                    login_data: JSON.stringify({
                        ehr_id: 'e167267c-16c9-4fe3-96ae-9cff5703e90a',
                        npi_id: '4236464757', mr_id: '0000000001',
                        ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB7', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB8', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9'],
                        current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9', page_type: 1,
                    }),
                };
            }
        });
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PatientController,
                SsoService,
                SettingService,
                Logger,
                OhiService,
                TableSession,
                Requester,
                { provide: getRepositoryToken(TableSession), useClass: RepositoryMock },
                { provide: PatientCommonDetailService, useClass: PatientCommonServiceMock },
                { provide: PatientBloodPressureDetailService, useClass: PatientBloodPressureDetailServiceMock },
                { provide: PatientListService, useClass: PatientListServiceMock },
                { provide: PatientPersonalBpService, useClass: PatientPersonalBpServiceMock },
                { provide: UpdateHaidService, useClass: UpdateHaidServiceMock },
                { provide: ConfirmSessionService, useClass: ConfirmSessionServiceMock },
                { provide: Logger, useClass: LoggerServiceMock },
                { provide: SettingService, useClass: SettingServiceMock },
                { provide: OhiService, useClass: OhiService },
                { provide: TableSession, useClass: TableSession },
                { provide: SsoService, useClass: SsoService },
                // { provide: ErrorCode, useClass: ErrorCodeMock},
            ],
        }).compile();

        controller = module.get<PatientController>(PatientController);
        patientCommonService = module.get<PatientCommonDetailService>(PatientCommonDetailService);
        patientBloodPressureDetailService = module.get<PatientBloodPressureDetailService>(PatientBloodPressureDetailService);
        patientListService = module.get<PatientListService>(PatientListService);
        patientPersonalBpService = module.get<PatientPersonalBpService>(PatientPersonalBpService);
        updateHaidService = module.get<UpdateHaidService>(UpdateHaidService);
        confirmSessionService = module.get<ConfirmSessionService>(ConfirmSessionService);
        logger = module.get<Logger>(Logger);
        sessionRepository = module.get<Repository<TableSession>>(getRepositoryToken(TableSession));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Case No 1: Test commonDetail ', () => {
        it('It should return an instance of Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    ha_user_ids: [
                        'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                        'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
                },
                path: '/dashboard/commonDetail',
            };
            try {
                await controller.commonDetail(req);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 2 Test commonDetail', () => {
        it('It should return an instance of not Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                    ha_user_ids: [
                        'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                        'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
                },
                path: '/dashboard/commonDetail',
            };
            try {
                await controller.commonDetail(req);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 3: Test patientList ', () => {
        it('It should return an instance of Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8m1',
                    ha_user_ids: [
                        'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                        'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
                    type: 1,
                },
            };
            const body = new RequestPatientList({
                type: 1,
            });
            try {
                await controller.patientList(req, body);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 4 Test  patientList', () => {
        it('It should return an instance of not Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                    ha_user_ids: [
                        'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                        'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2'],
                    type: 2,
                },
            };
            const body = new RequestPatientList({
                type: 2,
            });
            try {
                await controller.patientList(req, body);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 5: Test bloodPressureDetail ', () => {
        it('It should return an instance of Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                },
            };
            const body = new RequestBloodPressureDetail({
                date_from: '2020-01-03',
                date_do: '2020-01-13',
            });
            try {
                await controller.bloodPressureDetail(req, body);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 6 Test  bloodPressureDetail', () => {
        it('It should return an instance of not Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                },
            };
            const body = new RequestBloodPressureDetail({
                date_from: '2020-01-03',
                date_do: '2020-01-13',
            });
            try {
                await controller.bloodPressureDetail(req, body);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 7: Test getPersonalBloodPressure ', () => {
        it('It should return an instance of Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                },
            };
            try {
                await controller.getPersonalBloodPressure(req);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 8 Test  getPersonalBloodPressure', () => {
        it('It should return an instance of not Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                },
            };
            try {
                await controller.getPersonalBloodPressure(req);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 9: Test setPersonalBloodPressure ', () => {
        it('It should return an instance of Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                },
            };
            const body = new RequestSetPersonalBloodPressure({
                target_sys: 170,
                target_dia: 90,
                threshold_sys: 180,
                threshold_dia: 100,
            });
            try {
                await controller.setPersonalBloodPressure(req, body);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 10 Test  setPersonalBloodPressure ', () => {
        it('It should return an instance of not Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                },
            };
            const body = new RequestSetPersonalBloodPressure({
                target_sys: 170,
                target_dia: 90,
                threshold_sys: 180,
                threshold_dia: 100,
            });
            try {
                await controller.setPersonalBloodPressure(req, body);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 11: Test updateHaid ', () => {
        it('It should return an instance of Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                },
            };
            const body = new RequestUpdateHaid();
            body.ha_user_id = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1';
            const res: any = 'ok';
            try {
                await controller.updateHaid(req, body, res);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 12 Test  updateHaid', () => {
        it('It should return an instance of not Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                },
            };
            const body = new RequestUpdateHaid();
            body.ha_user_id = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2';
            const res: any = 'ok';
            try {
                await controller.updateHaid(req, body, res);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 13: Test confirmSession ', () => {
        it('It should return an instance of Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                },
            };
            const body = new RequestConfirmSessionId();
            body.sessionId = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1';
            const res: any = 'ok';
            try {
                await controller.confirmSession(req, body, res);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 14 Test  confirmSession', () => {
        it('It should return an instance of not Problem Exeption', async (done) => {
            const req: any = {
                query: {
                    current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                },
            };
            const body = new RequestConfirmSessionId();
            body.sessionId = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2';
            const res: any = 'ok';
            try {
                await controller.confirmSession(req, body, res);
            } catch (error) {
                done();
            }
            done();
        });
    });
});
