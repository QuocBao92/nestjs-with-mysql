import { Test, TestingModule } from '@nestjs/testing';
import { Requester, ErrorCode, ResponseProblemException, ProblemException, MessageType, CodeType, ProcessingType } from '../common';
import axios from 'axios';
import * as sinon from 'sinon';

describe('ErrorCode', () => {
    let errorCode: ErrorCode;

    let post;
    let get;
    beforeAll(async () => {

        post = sinon.stub(axios, 'post').callsFake(() => {
            return { status: 500 };
        });

        get = sinon.stub(axios, 'get').callsFake((jwt: string, options?: any) => {
            return { status: 500 };
        });
    });
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ErrorCode,
            ],
        }).compile();

        errorCode = module.get<ErrorCode>(ErrorCode);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(errorCode).toBeDefined();
    });

    describe('Case No 1: Test generalErrorCode', () => {
        it('Test ErrorCode', async (done) => {
            await ErrorCode.generalErrorCode(null, null, null, null);
            done();
        });
    });

    describe('Case No 2: Test excerptNo', () => {
        it('Test ErrorCode', async (done) => {
            await ErrorCode.excerptNo(123);
            done();
        });
    });

    describe('Case No 3: Test message', () => {
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.AuthFailed, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.AuthHasExpired, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.SessionExpired, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.NotValid, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.IsRequired, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.Invalid, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.MustBeNewerThan, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.MustBeLowerThan, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.InternalServerError, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.InvalidFormat, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.MustBeANumber, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.MustBeObjectArray, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.MustBeUnique, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.CasesExceedsTheRange, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.Conflict, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.IsDeleted, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.SessionIDCertificationFailed, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.JSONMessageIsNotParseable, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.Mustbe64Characters, 's');
            done();
        });
        it('Test Requester', async (done) => {
            await ErrorCode.message(MessageType.MustbeAlphanumeric, 's');
            done();
        });
    });
});
