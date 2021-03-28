    import { Test, TestingModule } from '@nestjs/testing';
    import { Keys, Problem, ProblemException } from '../common';
    import { Logger } from '../common/cloudwatch-logs';
    import { OhiService } from '../ohi/ohi.service';
    import { GetPersonalBloodPressureModel, SetPersonalBloodPressureModel } from '../patients/model/patient-model';
    import { PatientPersonalBpService } from '../patients/patient-personal-blood-pressure.service';
    import { SettingService } from '../setting/setting.service';

    describe('PatientPersonalBpService', () => {
        let service: PatientPersonalBpService;
        let ohiService: OhiService;
        let settingService: SettingService;
        let logger: Logger;

        // tslint:disable-next-line: max-classes-per-file
        class OhiServiceMock {
            public getPersonalBPInfo = jest.fn((param1, param2) => {
                if (param1.ha_user_id[0] === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3') {
                    return new Problem();
                } else {
                    return '[{ha_user_id: "A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2", goal_dia: 86, goal_sys: 142, dia_threshold: 104, sys_threshold: 157, created_at: 1578003694836, updated_at: 1579896645145 }]';
                }
            });

            public setPersonalBPInfo = jest.fn((param1, param2) => {
                if (param1.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5') {
                    return new Problem();
                } else {
                    return '[{ha_user_id: "A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4", goal_dia: 80, goal_sys: 100, threshold_sys: 120, threshold_dia: 110, created_at: 1578003694836, updated_at: 1579896645145 }]';
                }
            });
        }

        // tslint:disable-next-line: max-classes-per-file
        class LoggerServiceMock {
            public debug = jest.fn();
            public fatal = jest.fn();
            public error = jest.fn();
            public warn = jest.fn();
            public info = jest.fn();
        }

        // tslint:disable-next-line: max-classes-per-file
        class SettingServiceMock {
            public getValueByKeys = jest.fn((a) => {
                if (a.length === 4 && a[0] !== null && a[1] !== null && a[2] !== null && a[3] !== null) {
                    return [
                        { setting_key: 'dia_max', setting_value: 279 },
                        { setting_key: 'dia_min', setting_value: 41 },
                        { setting_key: 'sys_max', setting_value: 254 },
                        { setting_key: 'sys_min', setting_value: 41 },
                    ];
                }

                if (a.length === 4 && a[0] === null && a[1] === null && a[2] === null && a[3] === null) {
                    return [
                        { setting_key: 'dia_max', setting_value: null },
                        { setting_key: 'dia_min', setting_value: null },
                        { setting_key: 'sys_max', setting_value: null },
                        { setting_key: 'sys_min', setting_value: null },
                    ];
                }

                if (a.length === 3) {
                    throw Error();
                }

                return new ProblemException();
            });
        }

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    PatientPersonalBpService,
                    { provide: OhiService, useClass: OhiServiceMock },
                    { provide: SettingService, useClass: SettingServiceMock },
                    { provide: Logger, useClass: LoggerServiceMock },
                ],
            }).compile();

            service = module.get<PatientPersonalBpService>(PatientPersonalBpService);
            ohiService = module.get<OhiService>(OhiService);
            settingService = module.get<SettingService>(SettingService);
            logger = module.get<Logger>(Logger);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        describe('Case No 1 Test getPersonalBloodPressure with error the HA-ID is not included in the session data', () => {
            it('It should return an instance of Problem Exeption', (done) => {
                const requestModel = new GetPersonalBloodPressureModel({
                });
                service.getPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 2 Test getPersonalBloodPressure object "personalBPInfo" get from OHI is null or undefined or get ProblemException', () => {
            it('It should return ProblemException.API_InternalServerError()', async (done) => {
                const requestModel = new GetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3',
                });
                await service.getPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 3 Test getBpLimit call function getting data from setting table has a ProblemException', () => {
            it('It should return ProblemException.API_InternalServerError()', (done) => {
                const requestModel = new GetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                });
                service.settingKeys = [Keys.sys_max];
                service.getPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 4 Test getBpLimit call function getting data from setting table throw a ProblemException', () => {
            it('It should return ProblemException.API_InternalServerError()', (done) => {
                const requestModel = new GetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                });
                service.settingKeys = [Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.getPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 5 Test getBpLimit value of object get from setting table is empty', () => {
            it('It should return log fatal', (done) => {
                const requestModel = new GetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                });
                service.settingKeys = [null, null, null, null];
                service.getPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 6 Test getPersonalBloodPressure succesfully', () => {
            it('It should return an object contains data personalBloodPressure', (done) => {
                const requestModel = new GetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                });
                service.settingKeys = [Keys.sys_max, Keys.dia_max, Keys.sys_min, Keys.dia_min];
                service.getPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 7 Test setPersonalBloodPressure the HA-ID is not included in the session data', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                });
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 8 Test setPersonalBloodPressure getting data from setting table throw an ProblemException', () => {
            it('It should return ProblemException.API_InternalServerError()', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                });
                service.settingKeys = [Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 9 Test setPersonalBloodPressure "target_sys" is null or undefined', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 10 Test setPersonalBloodPressure "target_sys" is not a number', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 'g',
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 11 Test setPersonalBloodPressure "target_sys" is not in range of min and max limit of sys BP', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 20,
                });
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 12 Test setPersonalBloodPressure "target_dia" is null or undefined', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 155,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 13 Test setPersonalBloodPressure "target_dia" is not a number', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 155,
                    target_dia: 'h',
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 14 Test setPersonalBloodPressure "target_dia" is not in range of min and max limit of dia BP', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 155,
                    target_dia: 20,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 15 Test setPersonalBloodPressure when the "target_dia" BP is larger than the "target_sys" BP', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 120,
                    target_dia: 140,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 16 Test setPersonalBloodPressure when the "threshold_sys" BP is null or undefined', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 140,
                    target_dia: 120,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 17 Test setPersonalBloodPressure when the "threshold_sys" BP is not a number', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 140,
                    target_dia: 120,
                    threshold_sys: 'g',
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 18 Test setPersonalBloodPressure when the "threshold_sys" BP is not in range of min and max limit of sys BP', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 140,
                    target_dia: 120,
                    threshold_sys: 300,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 19 Test setPersonalBloodPressure when the "threshold_sys" BP is smaller than or equal to "target_sys" BP', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 140,
                    target_dia: 120,
                    threshold_sys: 100,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 20 Test setPersonalBloodPressure when the "threshold_dia" BP is null or undefined', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 100,
                    target_dia: 70,
                    threshold_sys: 120,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 21 Test setPersonalBloodPressure when the "threshold_dia" BP is not a number', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 100,
                    target_dia: 70,
                    threshold_sys: 120,
                    threshold_dia: 'f',
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 22 Test setPersonalBloodPressure when the "threshold_dia" BP is not in range of min and max limit of dia BP', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 100,
                    target_dia: 70,
                    threshold_sys: 120,
                    threshold_dia: 19,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 23 Test setPersonalBloodPressure when the "threshold_dia" BP is larger than or equal to "threshold_sys"', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 100,
                    target_dia: 70,
                    threshold_sys: 120,
                    threshold_dia: 190,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 24 Test setPersonalBloodPressure when the "target_dia" BP is larger than or equal to "threshold_dia"', () => {
            it('It should return an instance of ProblemException', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 100,
                    target_dia: 80,
                    threshold_sys: 120,
                    threshold_dia: 75,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 25 Test setPersonalBloodPressure when the personal blood pressure API returns an error', () => {
            it('It should return ProblemException.API_InternalServerError()', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5',
                    target_sys: 100,
                    target_dia: 80,
                    threshold_sys: 120,
                    threshold_dia: 110,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });

        describe('Case No 26 Test setPersonalBloodPressure successfully', () => {
            it('It should return an instance of Result with code 0', (done) => {
                const requestModel = new SetPersonalBloodPressureModel({
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4',
                    target_sys: 100,
                    target_dia: 80,
                    threshold_sys: 120,
                    threshold_dia: 110,
                });
                service.settingKeys = [Keys.dia_min, Keys.sys_max, Keys.dia_max, Keys.sys_min];
                service.setPersonalBloodPressure(requestModel);
                done();
            });
        });
    });
