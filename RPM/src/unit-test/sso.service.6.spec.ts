import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JWT } from '@panva/jose';
import { ConfigService } from 'aws-sdk';
import { mockResponse } from 'mock-req-res';
import { of } from 'rxjs';
import * as sinon from 'sinon';
import { Repository } from 'typeorm';
import { Problem, Requester } from '../common';
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
    }
    // tslint:disable-next-line:max-classes-per-file
    class OhiServiceMock {
        public getHAID = jest.fn((a, b) => {
            return new Problem({ status: 500 });
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

        verify = await sinon.stub(JWT, 'verify').callsFake(() => {
            return Promise.resolve({ success: 'verify success' });
        });

        decode = sinon.stub(JWT, 'decode').callsFake((jwt: string, options?: any) => {
            return { payload: { npi: 123, patient_ids: [{ id_type: 'EHRID', id: '123' }] } };
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
                { provide: OhiService, useClass: OhiServiceMock },
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
        it('login - Case No 15- Test login with error getHAID status: 500', async (done) => {
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
});
