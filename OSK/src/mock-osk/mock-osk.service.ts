import { Injectable } from '@nestjs/common';
import { RequestDetectUpTrend } from '../model/request-model/detect-up-trend-bp';
import { RequestDetectDownTrendBp } from '../model/request-model/detect-down-trend-bp';
import { RequestDetectContraryTrendsBpAndPulse } from '../model/request-model/detect-contranry-bp';
import { RequestDetectBradycarDia } from '../model/request-model/detect-bradycar-dia';
import { RequestDetectLowBP } from '../model/request-model/detect-low-bp';
import { ResponseDetectUpTrendBP } from '../model/response-model/detect-up-trend-bp';
import { ResponseDetecDownTrendBP } from '../model/response-model/detect-dow-trend-bp';
import { ResponseDetectContraryTrendsAndPulse } from '../model/response-model/detect-contrany-trend-pulse';
import { ResponseDetectBradycarDia } from '../model/response-model/detect-bradycar-dia';
import { ResponseDetectLowBP } from '../model/response-model/detect-low-bp';
// import { Problem } from './mock-osk.controller';

@Injectable()
export class MockOskService {
    getRandomvalue(): number {
        const array: number[] = [0, 0, 0, 0, 0, 0, 0, 1, null];
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomInterger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getDetectUpTrendBp(body: RequestDetectUpTrend) {
        const dataUpTrend: ResponseDetectUpTrendBP = {
            returnedValue: {
                sys: {
                    am: this.getRandomvalue(),
                    pm: this.getRandomvalue(),
                    daily: this.getRandomvalue(),
                },
                dia: {
                    am: this.getRandomvalue(),
                    pm: this.getRandomvalue(),
                    daily: this.getRandomvalue(),
                },
            },
        };
        console.log('dataUpTrend', dataUpTrend);
        return dataUpTrend;
    }

    async detectDownTrendBP(body: RequestDetectDownTrendBp) {
        const dataDownTrend: ResponseDetecDownTrendBP = {
            returnedValue: {
                sys: {
                    am: this.getRandomvalue(),
                    pm: this.getRandomvalue(),
                    daily: this.getRandomvalue(),
                },
                dia: {
                    am: this.getRandomvalue(),
                    pm: this.getRandomvalue(),
                    daily: this.getRandomvalue(),
                },
            },
        };
        return dataDownTrend;
    }

    async detectContraryTrendsBPandPulse(body: RequestDetectContraryTrendsBpAndPulse) {
        const item = [[0, 0], null];
        const dataContraryTrend: ResponseDetectContraryTrendsAndPulse = {
            returnedValue: {
                sys: {
                    am: this.getRandomInterger(0, 100) < 80 ? [0, 0] : null,
                    pm: this.getRandomInterger(0, 100) < 80 ? [0, 0] : null,
                    daily: this.getRandomInterger(0, 100) < 80 ? [0, 0] : null,
                },
                dia: {
                    am: this.getRandomInterger(0, 100) < 80 ? [0, 0] : null,
                    pm: this.getRandomInterger(0, 100) < 80 ? [0, 0] : null,
                    daily: this.getRandomInterger(0, 100) < 80 ? [0, 0] : null,
                },
            },
        };
        return dataContraryTrend;
    }

    async detectBradycardia(body: RequestDetectBradycarDia) {
        const dataBradycardia: ResponseDetectBradycarDia = {
            returnedValue: {
                result: 0,
            },
        };
        return dataBradycardia;
    }

    async detectLowBP(body: RequestDetectLowBP) {
        const dataBradycardia: ResponseDetectLowBP = {
            returnedValue: {
                result: {
                    sys: this.getRandomvalue(),
                    dia: this.getRandomvalue(),
                },
            },
        };
        return dataBradycardia;
    }
}
