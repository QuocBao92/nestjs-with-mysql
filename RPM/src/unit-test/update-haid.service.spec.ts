import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { PatientContract } from '../patients/entity/patient-contract.entity';
import { RequestUpdateHaid } from '../patients/model/request-model/request-update-haid';
import { UpdateHaidService } from '../patients/update-haid.service';
import { Repository } from 'typeorm';
import { Logger } from '../common/cloudwatch-logs';
import { TableSession } from '../sso/entity/table_session.entity';

describe('UpdateHaidService', () => {
    let service: UpdateHaidService;
    let patientContractRepository: Repository<PatientContract>;
    let sessionRepository: Repository<TableSession>;
    let logger: Logger;
    class RepositoryContractMock {
        public findOne = jest.fn((a) => {
            if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof1812') {
                return true;
            } else if (a.ha_user_id === 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8302') {
                throw Error();
            } else {
                return null;
            }
        });
    }
    // tslint:disable-next-line: max-classes-per-file
    class RepositorySessionMock {

        public save = jest.fn((a, b) => {
            if (Array.isArray(a)) {
                throw Error();
            } else {
                return of(a, b);
            }
        });
        public findOne = jest.fn((a) => {
            if (a.where.access_token === 'e7c2b61fce096017b9d212f143f8b7cfbbe76d0059326df84be9b89aa1950e3f354a89747a8ba4fe390ade06edc96ee576632ecf081330652be55fc2451f26fc') {
                return {
                    session_id: '021198d4566ab2f2c24e14a176dbcb5ff73a173251d4760bd72bf55ad81daa4ddb1db1b61d918986a119795d8fd56375c92c0a04c43f626886299f6f8fe2b588',
                    login_data: JSON.stringify({
                        ehr_id: 'e167267c-16c9-4fe3-96ae-9cff5703e90a',
                        npi_id: '4236464757', mr_id: '0000000001', ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB7', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB8', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9'], current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9', page_type: 1,
                    }),
                };
            } else if (a.where.access_token === 'ff11f27e8273222306e06d27a439727b415218f65dc7a0c68362ae482031e45592d8ab41bd20daa426c50fbfd89216aa9366a19e116c812640dded1856cdb4b0') {
                return null;
            } else {
                throw Error();
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
    beforeEach(async () => {
        const mockRepository = jest.fn(() => ({
            metadata: {
                columns: [],
                relations: [],
            },
        }));
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateHaidService,
                Logger,
                { provide: getRepositoryToken(TableSession), useClass: RepositorySessionMock },
                { provide: getRepositoryToken(PatientContract), useClass: RepositoryContractMock },
                { provide: Logger, useClass: LoggerServiceMock },
            ],
        }).compile();
        service = module.get<UpdateHaidService>(UpdateHaidService);
        logger = module.get<Logger>(Logger);
        patientContractRepository = module.get<Repository<PatientContract>>(getRepositoryToken(PatientContract));
        sessionRepository = module.get<Repository<TableSession>>(getRepositoryToken(TableSession));
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Case No 1 - updateHaid with error query not found', () => {
        it('updateHaid', (done) => {
            const Model = new RequestUpdateHaid();
            Model.ha_user_id = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8302';
            const req: any = {
                query: {
                    access_token: 'e7c2b61fce096017b9d212f143f8b7cfbbe76d0059326df84be9b89aa1950e3f354a89747a8ba4fe390ade06edc96ee576632ecf081330652be55fc2451f26fc',
                },
            };
            service.updateHaid(req, Model);
            done();
        });
    });

    describe('Case No 2 - updateHaid with error haid undefined or lenght = 0', () => {
        it('updateHaid', (done) => {
            const Model = new RequestUpdateHaid();
            const req: any = {
                query: {
                    access_token: 'e7c2b61fce096017b9d212f143f8b7cfbbe76d0059326df84be9b89aa1950e3f354a89747a8ba4fe390ade06edc96ee576632ecf081330652be55fc2451f26fc',
                },
            };
            service.updateHaid(req, Model);
            done();
        });
    });

    describe('Case No 3 - updateHaid with error haid is not string consisting of only alphanumeric characters', () => {
        it('updateHaid', (done) => {
            const Model = new RequestUpdateHaid();
            Model.ha_user_id = 'AAAA0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof@@@@';
            const req: any = {
                query: {
                    access_token: 'e7c2b61fce096017b9d212f143f8b7cfbbe76d0059326df84be9b89aa1950e3f354a89747a8ba4fe390ade06edc96ee576632ecf081330652be55fc2451f26fc',
                },
            };
            service.updateHaid(req, Model);
            done();
        });
    });

    describe('Case No 4 - updateHaid with error haid is not 64 character', () => {
        it('updateHaid', (done) => {
            const Model = new RequestUpdateHaid();
            Model.ha_user_id = 'ksdkjafkjdhksjfhakjsdf';
            const req: any = {
                query: {
                    access_token: 'e7c2b61fce096017b9d212f143f8b7cfbbe76d0059326df84be9b89aa1950e3f354a89747a8ba4fe390ade06edc96ee576632ecf081330652be55fc2451f26fc',
                },
            };
            service.updateHaid(req, Model);
            done();
        });
    });

    describe('Case No 5 - updateHaid with error patient contract not found', () => {
        it('updateHaid', (done) => {
            const Model = new RequestUpdateHaid();
            Model.ha_user_id = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof1111';
            const req: any = {
                query: {
                    access_token: 'e7c2b61fce096017b9d212f143f8b7cfbbe76d0059326df84be9b89aa1950e3f354a89747a8ba4fe390ade06edc96ee576632ecf081330652be55fc2451f26fc',
                },
            };
            service.updateHaid(req, Model);
            done();
        });
    });

    describe('Case No 6 - updateHaid with error patientcontract return true but result find on session table - not exist - return problem ', () => {
        it('updateHaid', (done) => {
            const Model = new RequestUpdateHaid();
            Model.ha_user_id = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof1812';
            const req: any = {
                query: {
                    access_token: 'ff11f27e8273222306e06d27a439727b415218f65dc7a0c68362ae482031e45592d8ab41bd20daa426c50fbfd89216aa9366a19e116c812640dded1856cdb4b0',
                },
            };
            service.updateHaid(req, Model);
            done();
        });
    });

    describe('Case No 7 - updateHaid with error patientcontract return true and save on session table return true', () => {
        it('updateHaid', (done) => {
            const Model = new RequestUpdateHaid();
            Model.ha_user_id = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof1812';
            const req: any = {
                query: {
                    access_token: 'e7c2b61fce096017b9d212f143f8b7cfbbe76d0059326df84be9b89aa1950e3f354a89747a8ba4fe390ade06edc96ee576632ecf081330652be55fc2451f26fc',
                },
            };
            service.updateHaid(req, Model);
            done();
        });
    });

    describe('Case No 8 - updateHaid with error patientcontract return true and save on session table return error', () => {
        it('updateHaid', (done) => {
            const Model = new RequestUpdateHaid();
            Model.ha_user_id = 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof1812';
            const req: any = {
                query: {
                    access_token: '021198d4566ab2f2c24e14a176dbcb5ff73a173251d4760bd72bf55ad81daa4ddb1db1b61d918986a119795d8fd56375c92c0a04c43f626886299f6f8fe2b588',
                },
            };
            service.updateHaid(req, Model);
            done();
        });
    });
});
