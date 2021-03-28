import { Test, TestingModule } from '@nestjs/testing';
import { Requester } from '../common';
import axios from 'axios';
import * as sinon from 'sinon';

describe('Requester', () => {
    let requester: Requester;

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
                Requester,
            ],
        }).compile();

        requester = module.get<Requester>(Requester);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(requester).toBeDefined();
    });

    describe('Case No 1: Test retryGetRequest with isAlgo is true', () => {
        it('Test Requester', async (done) => {
            await requester.retryGetRequest(null, null, null, null, true);
            done();
        });
    });

    describe('Case No 2: Test retryPostRequest with isAlgo is true', () => {
        it('Test Requester', async (done) => {
            await requester.retryPostRequest(null, null, null, null, null, true);
            done();
        });
    });

    describe('Case No 3: Test retryPostRequest with isAlgo is false', () => {
        it('Test Requester', async (done) => {
            await requester.retryPostRequest(null, null, null, null, null, false);
            done();
        });
    });
});
