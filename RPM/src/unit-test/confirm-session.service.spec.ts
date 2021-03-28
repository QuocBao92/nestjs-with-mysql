import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { Problem, Requester } from '../common';
import { Logger } from '../common/cloudwatch-logs';
import { OhiService } from '../ohi/ohi.service';
import { ConfirmSessionService } from '../patients/confirm-session.service';
import { RequestConfirmSessionId } from '../patients/model/request-model/request-confirm-session-id';
import { SettingService } from '../setting/setting.service';
import { TableSession } from '../sso/entity/table_session.entity';

describe('ConfirmSessionService', () => {
    let service: ConfirmSessionService;
    let sessionRepository: Repository<TableSession>;
    let logger: Logger;
    let ohiService: OhiService;
    let settingService: SettingService;

    //#region Create test
    class RepositoryMock {
        public findOne = jest.fn((a) => {
            // Case 1
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b1') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b1',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464757","mr_id":"0000000003","current_ha_user_id":"A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3","screen_type":"patient-detail"}',
                    exp_date: (new Date().getTime() + 86000000).toString(),
                };
            }
            // case 3
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b2') {
                return null;
            }
            // Case 4
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b3') {
                throw Error();
            }
            // Case 5: exp date expired
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b6') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b6',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464757","mr_id":"0000000003","current_ha_user_id":"A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3","screen_type":"patient-detail"}',
                    exp_date: (new Date().getTime() - 86000000).toString(),
                };
            }
            // Case 6: Screen_type : not patient-list or patient-detail
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b7') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b7',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464757","mr_id":"0000000003","current_ha_user_id":"A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3","screen_type":"ok"}',
                    exp_date: (new Date().getTime() + 86000000).toString(),
                };
            }
            // Case 7: not have haids.
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b8') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b8',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464757","mr_id":"0000000003","current_ha_user_id":"A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3","screen_type":"list-patient"}',
                    exp_date: (new Date().getTime() + 86000000).toString(),
                };
            }
            // Case 8: npi_id return Problem
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b9') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b8',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464756","current_ha_user_id":"A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3","screen_type":"list-patient"}',
                    exp_date: (new Date().getTime() + 86000000).toString(),
                };
            }
            // Case 9. npi_id return Problem with status 400
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b10') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097bf',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464755","current_ha_user_id":"A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3","screen_type":"list-patient"}',
                    exp_date: (new Date().getTime() + 86000000).toString(),
                };
            }
            // Case 10: screen type is patient detail and current_ha_user_id  is undefiend
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b11') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097bh',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464757","mr_id":"0000000003","screen_type":"patient-detail"}',
                    exp_date: (new Date().getTime() + 86000000).toString(),
                };
            }
            // Case 11: npi_id return Problem with status 400
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b12') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097bh',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464755","mr_id":"0000000003","screen_type":"patient-detail"}',
                    exp_date: (new Date().getTime() + 86000000).toString(),
                };
            }
            // Case 12: npi_id return Problem with status !400
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b13') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097bh',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464756","mr_id":"0000000003","screen_type":"patient-detail"}',
                    exp_date: (new Date().getTime() + 86000000).toString(),
                };
            }
            // Case 13: Cannot save session to database.
            if (a.where.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b14') {
                return {
                    session_id: '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b1',
                    login_data: '{"ehr_id":"e3fedf48-c8bf-4728-845f-cb810001b571","npi_id":"4236464757","mr_id":"0000000003","current_ha_user_id":"A8fk0akc91juab91u76la92jnmlqofA8fk0akc91juab91u76la92jnmlqof8mB3","screen_type":"patient-detail"}',
                    exp_date: (new Date().getTime() + 86000000).toString(),
                };
            }
        });
        // Case 13: Cannot save session to database.
        public save = jest.fn((a) => {
            if (a.session_id === '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b14') {
                throw Error();
            } else {
                return of(a);
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
            if (a.ehr_id === 'e3fedf48-c8bf-4728-845f-cb810001b571' && a.npi_id === '4236464755') {
                return new Problem({
                    status: 400,
                });
            }
        });
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfirmSessionService,
                OhiService,
                Requester,
                Logger,
                { provide: SettingService, useClass: SettingServiceMock },
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
    //#endregion
    //#region  Test case
    describe('Case No 1: ConfirmSession with no error', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b1';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 2: ConfirmSession with error SessionID is not specified', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 3: ConfirmSession with error cannot find session in database', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b2';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 4: ConfirmSession with error cannot connect database', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b3';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 5: ConfirmSession with error: session expired', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b6';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 6: ConfirmSession with error screen type is not list-patient or patient-detail', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b7';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 7: ConfirmSession with session has screen type is list patient and not has ha_user_ids', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b8';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 8: ConfirmSession with session has screen type is list patient and not has ha_user_ids and call ohi returns HTTP status code not 400', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b9';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 9: ConfirmSession with session has screen type is list patient and not has ha_user_ids and call ohi returns HTTP status code 400', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b10';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 10: ConfirmSession with session has screen type is patient detail and current_ha_user_id  is undefiend', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b11';
            service.confirmSession(sessionItem);
            done();
        });
    });

    // tslint:disable-next-line:max-line-length
    describe('Case No 11: ConfirmSession with session has screen type is patient detail and current_ha_user_id  is undefiend and call ohi returns HTTP status code 400', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b12';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 12: ConfirmSession with session has screen type is patient detail and current_ha_user_id  is undefiend and call ohi returns HTTP status code not 400', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b13';
            service.confirmSession(sessionItem);
            done();
        });
    });

    describe('Case No 13: ConfirmSession with session error cannot save session to database', () => {
        it('Confirm Session', (done) => {
            const sessionItem = new RequestConfirmSessionId();
            sessionItem.sessionId = '0070bc3ee1ade2df4daddc5584c10725672607bcf247d6b0efc91788bf87f8724d7d1e4589274a8709859c74cd421701b89db8a358f885d2d8d061caf26097b14';
            service.confirmSession(sessionItem);
            done();
        });
    });
    //#endregion
});
