import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { Problem, ProblemException, Requester } from '../common';
import { Logger } from '../common/cloudwatch-logs';
import { OhiService } from '../ohi/ohi.service';
import { ConfirmSessionService } from '../patients/confirm-session.service';
import { SettingService } from '../setting/setting.service';
import { TableSession } from '../sso/entity/table_session.entity';
import { RequestConfirmSessionId } from '../patients/model/request-model/request-confirm-session-id';

describe('ConfirmSessionService', () => {
    let service: ConfirmSessionService;
    let sessionRepository: Repository<TableSession>;
    let logger: Logger;
    let ohiService: OhiService;
    let settingService: SettingService;

    //#region Create test for Setting Service Error
    // tslint:disable-next-line:max-classes-per-file
    class SettingServiceMockError2 {
        public getValueByKeys = jest.fn((a) => {
            // case 14: confirmSession with error getValuebyKeys return ProblemException
            return new ProblemException();
        });
    }

    //#region Create test
    // tslint:disable-next-line:max-classes-per-file
    class RepositoryMock {
        public findOne = jest.fn((a) => {
            // case 14: confirmSession with error getValuebyKeys return ProblemException
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b15') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b14',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464757","mr_id":"0000000002","screen_type":"patient-detail"}',
                    exp_date: '1620434199760',
                };
            }

            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b2') {
                return null;
            }
        });
        public save = jest.fn((a) => {
            return Math.random() < 0.5 ? Error() : of(a);
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
    class OhiServiceMock {
        public getHAID = jest.fn((a, b) => {
            if (a.ehr_id === 'e3fedf48-c8bf-4728-845f-cb810001b571' && a.npi_id === '4236464757') {
                return {
                    result: { code: '0', message: '' },
                    data: [
                        {
                            ha_user_id: 'A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3',
                            created_at: 1578149948282,
                            updated_at: 1579054842294,
                        },
                    ],
                };
            }

            if (a.ehr_id === 'e3fedf48-c8bf-4728-845f-cb810001b571' && a.npi_id === '4236464756') {
                return new Problem();
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
                ConfirmSessionService,
                OhiService,
                Requester,
                Logger,
                { provide: SettingService, useClass: SettingServiceMockError2 },
                { provide: getRepositoryToken(TableSession), useClass: RepositoryMock },
                { provide: OhiService, useClass: OhiServiceMock },
                { provide: Logger, useClass: LoggerServiceMock },
            ],
        }).compile();

        service = module.get<ConfirmSessionService>(ConfirmSessionService);
        settingService = module.get<SettingService>(SettingService);
        logger = module.get<Logger>(Logger);
        sessionRepository = module.get<Repository<TableSession>>(getRepositoryToken(TableSession));
        ohiService = module.get<OhiService>(OhiService);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Case No 14: ConfirmSession with error getValuebyKeys return ProblemException', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b15';
            service.confirmSession(sessionItem);
            done();
        });
    });
    //#endregion
});
