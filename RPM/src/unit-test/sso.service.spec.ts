import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JWT } from '@panva/jose';
import { ConfigService } from 'aws-sdk';
import { mockResponse } from 'mock-req-res';
import { of } from 'rxjs';
import * as sinon from 'sinon';
import { Repository } from 'typeorm';
import { Requester } from '../common';
import { OhiService } from '../ohi/ohi.service';
import { SettingService } from '../setting/setting.service';
import { TableSession } from '../sso/entity/table_session.entity';
import { SsoService } from '../sso/sso.service';

describe('SsoService', () => {

    let service: SsoService;
    let sessionRepository: Repository<TableSession>;
    let ohiService: OhiService;
    class RepositoryMock {
        public save = jest.fn((a) => of(a));
        public findOne = jest.fn((a) => {
            if (a.where.access_token === 'a9607e11901a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994fee') {
                return null;
            } else if (a.where.access_token === '12307e11901a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123') {
                throw Error();
            } else if (a.where.access_token === '45678911901a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123') {
                return { exp_date: '10000000' };
            } else if (a.where.access_token === '1111111111a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123') {
                return {
                    exp_date: (new Date().getTime() + 86000000).toString(),
                    login_data: {
                        ehr_id: 'e167267c-16c9-4fe3-96ae-9cff5703e90a',
                        npi_id: '4236464757', mr_id: '0000000001',
                        ha_user_ids: ['A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB1', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB2', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB4', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB5', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB6', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB7', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB8', 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9'],
                        current_ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB9', page_type: 1,
                    },
                };
            } else if (a.where.access_token === '22222222222a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123') {
                return {
                    exp_date: (new Date().getTime() + 86000000).toString(),
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
        public getValueByKey = jest.fn((a) => {
            if (a === 'session_period') {
                return '30000000';
            }
        });
    }

    let verify;
    let decode;
    beforeAll(async () => {

        verify = sinon.stub(JWT, 'verify').callsFake(() => {
            return Promise.resolve({ success: 'verify success' });
        });

        decode = sinon.stub(JWT, 'decode').callsFake((jwt: string, options?: any) => {
            return { payload: undefined };
        });
    });

    beforeEach(async () => {

        process.env.BASE_FRONTEND_URL = 'http://192.168.1.116:4200';
        process.env.REDOX_SECRET_KEY = 'c3ckoHquXyxRGVfMSS9BYKS0wHP7KVpwShylDzo53vjHmoEUiiwe0cbBtqn1jjyHlUblDMkX';
        process.env.REDOX_AUDIENCE = '851a2d49-a5f0-4599-af55-04298a7f3459';
        process.env.REDOX_ISSUER = '7ce6f387-c33c-417d-8682-81e83628cbd9';
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SsoService,
                OhiService,
                Requester,
                Logger,
                ConfigService,
                { provide: SettingService, useClass: SettingServiceMock },
                { provide: Logger, useClass: LoggerServiceMock },
                { provide: getRepositoryToken(TableSession), useClass: RepositoryMock },
            ],
            controllers: [],
            exports: [Logger],
        }).compile();
        service = module.get<SsoService>(SsoService);
        ohiService = module.get<OhiService>(OhiService);
        sessionRepository = module.get<Repository<TableSession>>(getRepositoryToken(TableSession));
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {

        it('login - Case No 7- Test login error with payload undefined', async (done) => {
            const req: any = {
                headers: {
                    authorization: 'Bearer 532a4faa01d86ff5ecaf8821b5ee4fbe4a88234bf308364942149cf4fb29c59297913ac477495f1822eba57b99b0f37056d730b9a5b0fb6396fee58b07817b72',
                },
            };
            const res = mockResponse();
            await service.login(req, res);
            done();
        });

    });

    describe('login', () => {
        it('login - Case No 8 - Test login if error when cannot get enviroment', async () => {
            const req: any = {
                headers: {
                    authorization: '532a4faa01d86ff5ecaf8821b5ee4fbe4a88234bf308364942149cf4fb29c59297913ac477495f1822eba57b99b0f37056d730b9a5b0fb6396fee58b07817b72',
                },
            };
            process.env.REDOX_SECRET_KEY = '';
            process.env.REDOX_AUDIENCE = '';
            process.env.REDOX_ISSUER = '';
            const res = mockResponse();
            await service.login(req, res);
        });
    });

    describe('login', () => {
        it('login - Case No 9 - Test login if error when idToken null or not have Bearer', async () => {
            const req: any = {
                headers: {
                    authorization: '532a4faa01d86ff5ecaf8821b5ee4fbe4a88234bf308364942149cf4fb29c59297913ac477495f1822eba57b99b0f37056d730b9a5b0fb6396fee58b07817b72',
                },
            };
            const res = mockResponse();
            await service.login(req, res);
        });
    });

    describe('validateRequest', () => {
        it('validateRequest - Case No 01 - Test validate Request with wrong request undefined ', async () => {
            const req: any = {
                headers: {
                    authorization: undefined,
                },
            };
            await service.validateRequest(req);
        });
    });

    describe('validateRequest', () => {
        it('validateRequest - Case No 02 - Test validate Request return is null or undefined session ', async () => {
            const req: any = {
                headers: {
                    authorization: 'Bearer a9607e11901a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994fee',
                },
            };
            await service.validateRequest(req);
        });
    });

    describe('validateRequest', () => {
        it('validateRequest - Case No 03 - Test validate Request with wrong find access token in session table error ', async () => {

            const req: any = {
                headers: {
                    authorization: 'Bearer 12307e11901a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123',
                },
            };
            await service.validateRequest(req);
        });
    });

    describe('validateRequest', () => {
        it('validateRequest - Case No 04 - Test validate Request with wrong date > ss.exp_date ', async () => {

            const req: any = {
                headers: {
                    authorization: 'Bearer 45678911901a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123',
                },
            };
            await service.validateRequest(req);
        });
    });

    describe('validateRequest', () => {
        it('validateRequest - Case No 05 - Test validate Request with wrong json parse login data ', async () => {
            const req: any = {
                headers: {
                    authorization: 'Bearer 1111111111a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123',
                },
            };
            await service.validateRequest(req);
        });
    });

    describe('validateRequest', () => {
        it('validateRequest - Case No 06 - Test validate Request return true', async () => {
            const req: any = {
                headers: {
                    authorization: 'Bearer 22222222222a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123',
                },
                query: {
                },
            };
            await service.validateRequest(req);
        });
    });

});
