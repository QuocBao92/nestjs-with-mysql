import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from 'aws-sdk';
import { Requester } from '../common';
import { EntryName, Logger } from '../common/cloudwatch-logs';
import { SettingService } from '../setting/setting.service';
import { OhiService } from '../ohi/ohi.service';

describe('OhiService', () => {

    let service: OhiService;
    let settingService: SettingService;
    let logger: Logger;
    let requester: Requester;

    // tslint:disable-next-line:max-classes-per-file
    class SettingServiceMock {
        public getValueByKey = jest.fn((a) => {
            if (a === 'ohi_retry_times') {
                return 10;
            } else if (a === 'ohi_retry_interval') {
                return 1;
            } else {
                throw Error;
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
                OhiService,
                { provide: SettingService, useClass: SettingServiceMock },
                { provide: Logger, useClass: LoggerServiceMock },
                { provide: Requester, useClass: Requester },
                { provide: ConfigService, useClass: ConfigService },
            ],
        }).compile();

        service = module.get<OhiService>(OhiService);
        logger = module.get<Logger>(Logger);
        settingService = module.get<SettingService>(SettingService);
        requester = module.get<Requester>(Requester);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Case No 15: Test retryGetData with no error', () => {
        it('Test retryGetData', async (done) => {
            const url = 'url call OHI';
            const apiName = 'api';
            const entryName: EntryName = EntryName.ApiGetHAID;
            service.retryGetData(url, apiName, entryName);
            done();
        });
    });

    describe('Case No 16: Test retryPostData', () => {
        it('Test retryPostData', async (done) => {
            const url = 'url call OHI';
            const apiName = 'api';
            const entryName: EntryName = EntryName.ApiGetHAID;
            service.retryPostData(url, apiName, entryName);
            done();
        });
    });
});
