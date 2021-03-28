/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ProblemException } from '../common';
import { Logger } from '../common/cloudwatch-logs';
import { ForesightController } from '../foresight/foresight.controller';
import { ForesightService } from '../foresight/foresight.service';
import { RequestRegister } from '../foresight/model/request-model';

describe('ForesightController', () => {
    let controller: ForesightController;
    let logger: Logger;
    let service: ForesightService;

    class ForesightServiceMock {
        public registerUser = jest.fn((params) => {
            if (params.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D555') {
                return new ProblemException();
            }

            return true;
        });

        public unregisterUser = jest.fn((params) => {
            if (params.ha_user_id === 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D555') {
                return new ProblemException();
            }

            return true;
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
                ForesightController,
                { provide: ForesightService, useClass: ForesightServiceMock },
                { provide: Logger, useClass: LoggerServiceMock },
            ],
        }).compile();

        controller = module.get<ForesightController>(ForesightController);
        logger = module.get<Logger>(Logger);
        service = module.get<ForesightService>(ForesightService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Case No 1 Test registerUser no error', () => {
        it('throw new HttpException(result, HttpStatus.OK', (done) => {
            const req: any = {};
            req.body = jest.fn().mockReturnValue(req);
            req.params = jest.fn().mockReturnValue(req);

            const registerModel = new RequestRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D577',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-18',
            });
            controller.registerUser(req, registerModel);
            done();
        });
    });

    describe('Case No 2 Test registerUser occurred an error', () => {
        it('throw new ResponseProblemException(req, result)', (done) => {
            const req: any = {};
            req.body = jest.fn().mockReturnValue(req);
            req.params = jest.fn().mockReturnValue(req);

            const registerModel = new RequestRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D555',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-18',
            });
            controller.registerUser(req, registerModel);
            done();
        });
    });

    describe('Case No 3 Test unregisterUser no error', () => {
        it('throw new HttpException(result, HttpStatus.OK', (done) => {
            const req: any = {};
            req.body = jest.fn().mockReturnValue(req);
            req.params = jest.fn().mockReturnValue(req);

            const registerModel = new RequestRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D577',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-18',
            });
            controller.unregisterUser(req, registerModel);
            done();
        });
    });

    describe('Case No 4 Test unregisterUser occurred an error', () => {
        it('throw new ResponseProblemException(req, result)', (done) => {
            const req: any = {};
            req.body = jest.fn().mockReturnValue(req);
            req.params = jest.fn().mockReturnValue(req);

            const registerModel = new RequestRegister({
                ha_user_id: 'OHQ833E2ED5647A33D00671B87797334EC3494C702E663D5AD205CF9E920D555',
                contract_weight_scale: 1,
                smartphone_use: 1,
                ha_regist_date: '2020-03-18',
            });
            controller.unregisterUser(req, registerModel);
            done();
        });
    });
});
