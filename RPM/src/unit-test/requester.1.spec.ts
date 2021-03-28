import { Test, TestingModule } from '@nestjs/testing';
import { Requester } from '../common';
import axios from 'axios';
import * as sinon from 'sinon';

describe('Helper', () => {
    let requester: Requester;

    let post;
    let get;
    beforeAll(async () => {

        post = sinon.stub(axios, 'post').callsFake(() => {
            return { status: 200 };
        });

        get = sinon.stub(axios, 'get').callsFake((jwt: string, options?: any) => {
            return { status: 200 };
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

    describe('Case No 4: Test Requester post with response has status 200', () => {
        it('Test Requester', async (done) => {
            await Requester.post(null, null, null);
            done();
        });
    });

    describe('Case No 5: Test Requester retryGetRequest with response has status 200', () => {
        it('Test Requester', async (done) => {
            await requester.retryGetRequest(null, null, null, null, true);
            done();
        });
    });

    describe('Case No 6: Test Requester retryPostRequest with response has status 200', () => {
        it('Test Requester', async (done) => {
            await requester.retryPostRequest(null, null, null, null, null, true);
            done();
        });
    });
});
