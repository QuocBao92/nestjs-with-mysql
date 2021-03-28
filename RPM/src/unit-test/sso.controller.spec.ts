/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ProblemException } from '../common';
import { Logger } from '../common/cloudwatch-logs';
import { SsoController } from '../sso/sso.controller';
import { SsoService } from '../sso/sso.service';

describe('SsoController', () => {
    let controller: SsoController;
    let service: SsoService;
    let logger: Logger;

    class SsoServiceMock {
        public login = jest.fn((params1, params2) => {
            if (params1.headers.authorization === 'Bearer 532a4faa01d86ff5ecaf8821b5ee4fbe4a88234bf308364942149cf4fb29c59297913ac477495f1822eba57b99b0f37056d730b9a5b0fb6396fee58b07817b72') {
                return true;
            }

            return new ProblemException();
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SsoController,
                { provide: SsoService, useClass: SsoServiceMock },
                { provide: Logger, useClass: LoggerServiceMock },
            ],
        }).compile();

        controller = module.get<SsoController>(SsoController);
        logger = module.get<Logger>(Logger);
        service = module.get<SsoService>(SsoService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Case No 1 Test sso occurred an error', () => {
        it('throw new HttpException(result, HttpStatus.OK', async (done) => {
            const req: any = {
                headers: {
                    authorization: 'Bearer 532a4faa01d86ff5ecaf8821b5ee4fbe4a88234bf308364942149cf4fb29c59297913ac477495f1822eba57b99b0f37056d730b9a5b0fb6396fee58b07817b72',
                },
            };

            const res: any = {};
            res.send = jest.fn().mockReturnValue(res);
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            try {
                await controller.sso(req, res);
            } catch (error) {
                done();
            }
            done();
        });
    });

    describe('Case No 2 Test sso no error', () => {
        it('throw new HttpException(result, HttpStatus.OK', async (done) => {
            const req: any = {
                headers: {
                    authorization: 'Bearer abc',
                },
            };
            const res: any = {};
            res.send = jest.fn().mockReturnValue(res);
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            try {
                await controller.sso(req, res);
            } catch (error) {
                done();
            }
            done();
        });
    });
});
