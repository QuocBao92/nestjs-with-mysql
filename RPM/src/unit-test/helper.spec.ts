import { Test, TestingModule } from '@nestjs/testing';
import { Helper } from '../common';
describe('Helper', () => {
    let helper: Helper;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Helper,
            ],
        }).compile();

        helper = module.get<Helper>(Helper);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should be defined', () => {
        expect(helper).toBeDefined();
    });

    describe('Case No 1: Test Helper with not has vitaldata', () => {
        it('Test Helper', async (done) => {
            await Helper.average(null, null, 7);
            done();
        });
    });

    describe('Case No 2: Test Helper with empty array vitaldata', () => {
        it('Test Helper', async (done) => {
            await Helper.average([], null, 7);
            done();
        });
    });

    describe('Case No 3: Test Helper with has array length of vitaldata greater than 7 ', () => {
        it('Test Helper', async (done) => {
            await Helper.average([{ ok: 1 }, { ok: 1 }, { ok: 1 }, { ok: 1 }, { ok: 1 }, { ok: 1 }, { ok: 1 }, { ok: 1 }], 'ok', 7);
            done();
        });
    });
});
