import { ForesightService } from '../foresight/foresight.service';
import { PatientContract } from '../patients/entity/patient-contract.entity';
import { Repository } from 'typeorm';
import { PatientAggregate } from '../patients/entity/patient-aggregate.entity';
import { SettingService } from '../setting/setting.service';
import { Logger } from '../common/cloudwatch-logs';
import { of } from 'rxjs';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestRegister, RequestUnRegister } from '../foresight/model/request-model';

describe('ForesightService', () => {
    let service: ForesightService;
    let patientContractRepository: Repository<PatientContract>;
    let patientAggregateRepository: Repository<PatientAggregate>;
    let settingService: SettingService;
    let logger: Logger;

    /**
     * RepositoryMockError
     */
    // tslint:disable-next-line:max-classes-per-file
    class RepositoryMock {
        public save = jest.fn((p) => {
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1') {
                throw Error();
            } else if (Array.isArray(p)) {
                throw Error();
            } else if (p.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D577' ||
                p.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D579' ||
                p.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D580' ||
                p.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D583') {
                throw Error();
            } else if (p.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D578') {
                return of(p);
            } else {
                return of(p);
            }
        });
        public update = jest.fn((a, b) => of({ a }, { ha_user_id: b }));
        public findOne = jest.fn((a) => {
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1') {
                return {
                    ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                    contract_weight: 1,
                    contract_application: 0,
                    delete_flag: 1,
                    regist_date: '2020-02-5',
                    update_date: '2020-02-5',
                };
            } else if (a.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D5ER') {
                throw Error();
            } else if (a.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D575') {
                return {
                    ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D575',
                    contract_weight: 1,
                    contract_application: 0,
                    delete_flag: 0,
                    regist_date: '2020-02-5',
                    update_date: '2020-02-5',
                };
            } else if (a.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D577') {
                return null;
            } else if (a.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D578') {
                return {
                    ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D578',
                    contract_weight: 1,
                    contract_application: 0,
                    delete_flag: 1,
                    regist_date: '2020-02-5',
                    update_date: '2020-02-5',
                };
            } else if (a.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D579') {
                return {
                    ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D579',
                    contract_weight: 1,
                    contract_application: 0,
                    delete_flag: 1,
                    regist_date: '2020-02-5',
                    update_date: '2020-02-5',
                };
            } else if (a.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D580') {
                return {
                    ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D580',
                    contract_weight: 1,
                    contract_application: 0,
                    delete_flag: 0,
                    regist_date: '2020-02-5',
                    update_date: '2020-02-5',
                };
            } else if (a.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D581') {
                return {
                    ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D581',
                    contract_weight: 1,
                    contract_application: 0,
                    delete_flag: 0,
                    regist_date: '2020-02-5',
                    update_date: '2020-02-5',
                };
            } else if (a.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D583') {
                return {
                    ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D583',
                    contract_weight: 1,
                    contract_application: 0,
                    delete_flag: 0,
                    regist_date: '2020-02-5',
                    update_date: '2020-02-5',
                };
            } else if (a.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D589') {
                return {
                    ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D589',
                    contract_weight: 1,
                    contract_application: 0,
                    delete_flag: 0,
                    regist_date: '2020-02-5',
                    update_date: '2020-02-5',
                };
            } else {
                return null;
            }
        });
        public delete = jest.fn((p) => {
            of({ p });
        });
    }

    /**
     * RepositoryMockError
     */
    // tslint:disable-next-line:max-classes-per-file
    class PatientAggregateRepositoryMock {
        public save = jest.fn((p) => {
            if (p.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2') {
                throw Error();
            } else {
                return of(p);
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

    /**
     * SettingServiceMock
     * Check data of (SettingServiceMock) in case true
     */
    // tslint:disable-next-line:max-classes-per-file
    class SettingServiceMock {
        public getValueByKey = jest.fn((a) => {
            return '[{"setting_id":1,"enabled_flag":0,"threshold_value":3,"threshold_unit":2,"period":2},{"setting_id":2,"enabled_flag":0,"threshold_value":5,"threshold_unit":2,"period":7}]';
        });
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ForesightService,
                { provide: SettingService, useClass: SettingServiceMock },
                { provide: getRepositoryToken(PatientContract), useClass: RepositoryMock },
                { provide: getRepositoryToken(PatientAggregate), useClass: PatientAggregateRepositoryMock },
                { provide: Logger, useClass: LoggerServiceMock },
            ],
        }).compile();

        service = module.get<ForesightService>(ForesightService);
        settingService = module.get<SettingService>(SettingService);
        logger = module.get<Logger>(Logger);
        patientContractRepository = module.get<Repository<PatientContract>>(getRepositoryToken(PatientContract));
        patientAggregateRepository = module.get<Repository<PatientAggregate>>(getRepositoryToken(PatientAggregate));

    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Case No 1 Test registerUser with error cannot insert into Patient summary information table', () => {
        it('It should return ProblemException.API_InternalServerError()', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 2 Test registerUser with error cannot connect to database', () => {
        it('It should return ProblemException.API_InternalServerError()', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D5ER',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 3 Test registerUser patient information registration occurred an error', () => {
        it('RegisterUser', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D577',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-18',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 4 Test registerUser succesfully', () => {
        it('RegisterUser', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D578',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-18',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 5 Test registerUser update contract occurred error', () => {
        it('It should return ProblemException.API_InternalServerError()', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D579',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-18',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 6 Test registerUser if record is exist and the unsubscription flag is 0 (contracted)', () => {
        it('It should return an instance of Problem Exception', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D580',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-18',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 7 Test validateRegisterUser with error haid is not 64 characters', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8m',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 8 Test validateRegisterUser with error haid not entered', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: '',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 9 Test validateRegisterUser with error haid not a string consisting of only alphanumeric characters', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: '#!$^^@',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 10 Test validateRegisterUser with error "contract_weight_scale" is a number other than 0 or 1', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 3,
                smartphone_use: 1,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 11 Test validateRegisterUser with error contract weight scale not entered', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1',
                smartphone_use: 1,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 12 Test validateRegisterUser with error "contract_weight_scale" is not an integer', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 'a',
                smartphone_use: 1,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 13 Test validateRegisterUser with error "smartphone_use" not entered', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 1,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 14 Test validateRegisterUser with error "smartphone_use" is not an integer', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 1,
                smartphone_use: 'a',
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 15 Test validateRegisterUser with error "smartphone_use" is a number other than 0 or 1', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 1,
                smartphone_use: 3,
                ha_regist_date: '2020-03-10',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 16 Test validateRegisterUser with error "ha_regist_date" not entered', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 1,
                smartphone_use: 1,
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 17 Test validateRegisterUser with error the format of "ha_regist_date" is not YYYY-MM-DD', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '18-03-2020',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 18 Test validateRegisterUser with error "ha_regist_date" is a non-existent date', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-02-31',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 19 Test validateRegisterUser with error "ha_regist_date" is a future date', () => {
        it('It should return an instance of ProblemException', (done) => {
            const registerModel = new RequestRegister({
                ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-05-25',
            });
            service.registerUser(registerModel);
            done();
        });
    });

    describe('Case No 20 Test unregisterUser if cannot connect to database', () => {
        it('It should return ProblemException.API_InternalServerError()', (done) => {
            const unregisterModel = new RequestUnRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D5ER',
            });
            service.unregisterUser(unregisterModel);
            done();
        });
    });

    describe('Case No 21 Test unregisterUser if patientContract is not exist', () => {
        it('It should return an instance of Problem Exception', (done) => {
            const unregisterModel = new RequestUnRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D577',
            });
            service.unregisterUser(unregisterModel);
            done();
        });
    });

    describe('Case No 22 Test unregisterUser if patientContract is exist and delete_flag = 1', () => {
        it('It should return an instance of Problem Exception', (done) => {
            const unregisterModel = new RequestUnRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D579',
            });
            service.unregisterUser(unregisterModel);
            done();
        });
    });

    describe('Case No 23 Test unregisterUser if patientContract is exist and delete_flag !== 1', () => {
        it('It should call function save of patientContractRepository', (done) => {
            const unregisterModel = new RequestUnRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D581',
            });
            service.unregisterUser(unregisterModel);
            done();
        });
    });

    describe('Case No 24 Test unregisterUser if error when save patient contract', () => {
        it('It should return ProblemException.API_InternalServerError()', (done) => {
            const unregisterModel = new RequestUnRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D583',
            });
            service.unregisterUser(unregisterModel);
            done();
        });
    });

    describe('Case No 25 Test validateUnregisterUser if "ha_user_id" is null or undefined', () => {
        it('It should return an instance of Problem Exception', (done) => {
            const unregisterModel = new RequestUnRegister({});
            service.unregisterUser(unregisterModel);
            done();
        });
    });

    describe('Case No 26 Test validateUnregisterUser if "ha_user_id" is a string consisting of only alphanumeric characters', () => {
        it('It should return an instance of Problem Exception', (done) => {
            const unregisterModel = new RequestUnRegister({
                ha_user_id: '#!$^^@',
            });
            service.unregisterUser(unregisterModel);
            done();
        });
    });

    describe('Case No 27 Test validateUnregisterUser if length of "ha_user_id" is not 64', () => {
        it('It should return an instance of Problem Exception', (done) => {
            const unregisterModel = new RequestUnRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D58',
            });
            service.unregisterUser(unregisterModel);
            done();
        });
    });
});
