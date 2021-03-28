    import { Test, TestingModule } from '@nestjs/testing';
    import { Repository } from 'typeorm';
    import { getRepositoryToken } from '@nestjs/typeorm';
    import { ConfigService } from 'aws-sdk';
    import { SettingInfo } from '../setting/entity/setting-info.entity';
    import { SettingService } from '../setting/setting.service';

    describe('SettingService', () => {
        let service: SettingService;
        let settingInfoRepository: Repository<SettingInfo>;

        class SettingRepositoryMock {
            public findOneOrFail = jest.fn((a) => {
                // tslint:disable-next-line:no-console
                if (a.where[0].setting_key === 'ohi_retry_times') {
                    const result = new SettingInfo();
                    result.setting_value = '10';
                    return result;
                }
            });
            public find = jest.fn((a) => {
                // tslint:disable-next-line:no-console
                if (a?.where[0]?.setting_key === 'ohi_retry_times') {
                    return 10;
                }
                throw Error();
            });

        }
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    SettingService,
                    { provide: getRepositoryToken(SettingInfo), useClass: SettingRepositoryMock },
                    { provide: ConfigService, useClass: ConfigService },
                ],
            }).compile();

            service = module.get<SettingService>(SettingService);
            settingInfoRepository = module.get<Repository<SettingInfo>>(getRepositoryToken(SettingInfo));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        describe('Case No 1: Test setting Service Get Value By Key with no error', () => {
            it('Get Value By Key', async (done) => {
                await service.getValueByKey('ohi_retry_times');
                done();
            });
        });

        describe('Case No 2: Test setting Service getValueByKeys with no error', () => {
            it('getValueByKeys', async (done) => {
                await service.getValueByKeys(['ohi_retry_times']);
                done();
            });
        });

        describe('Case No 3: Test setting Service getValueByKeys with error', () => {
            it('getValueByKeys', async (done) => {
                await service.getValueByKeys(['ohi_retry_times1']);
                done();
            });
        });
    });
