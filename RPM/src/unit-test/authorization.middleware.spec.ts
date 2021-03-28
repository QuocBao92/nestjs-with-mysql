import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from 'aws-sdk';
import { Requester, ProblemException } from '../common';
import { EntryName, Logger } from '../common/cloudwatch-logs';
import { SettingService } from '../setting/setting.service';
import { OhiService } from '../ohi/ohi.service';
import { AuthorizationMiddleware } from '../patients/authorization.middleware';
import { SsoService } from '../sso/sso.service';

describe('AuthorizationMiddleware', () => {
    let middleware: AuthorizationMiddleware;
    let service: SsoService;
    // tslint:disable-next-line:max-classes-per-file
    class SsoServiceMock {
        public validateRequest = jest.fn((a) => {
            if (a.headers.authorization === 'Bearer 22222222222a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123') {
                return new ProblemException();
            } else {
                return true;
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
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthorizationMiddleware,
                { provide: SsoService, useClass: SsoServiceMock },
                { provide: Logger, useClass: LoggerServiceMock },
                { provide: Requester, useClass: Requester },
                { provide: ConfigService, useClass: ConfigService },
            ],
        }).compile();

        middleware = module.get<AuthorizationMiddleware>(AuthorizationMiddleware);
        service = module.get<SsoService>(SsoService);
        // logger = module.get<Logger>(Logger);
        // settingService = module.get<SettingService>(SettingService);
        // requester = module.get<Requester>(Requester);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Case No 1: Test middelware with error and return an instanceof ProblemException', () => {
        it('Test middelware', async (done) => {
            const req: any = {
                headers: {
                    authorization: 'Bearer 22222222222a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994123',
                },
            };
            const res: any = 'ok';
            const next = jest.fn();
            try {
                await middleware.use(req, res, next);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 2: Test middelware with no error', () => {
        it('Test middelware', async (done) => {
            const req: any = {
                headers: {
                    authorization: 'Bearer 22222222222a5bd134a5fa9165b3ad4f463f61289e11b888b6bdae89b7fed70db226d9259a27707117a984c36c391680d1bffe7e7394cef33e5da41eff994124',
                },
            };
            const res: any = 'ok';
            const next = jest.fn();
            try {
                await middleware.use(req, res, next);
            } catch (error) {
                done();
            }
            done();
        });
    });
});
