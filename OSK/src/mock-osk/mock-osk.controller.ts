import { Controller, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { MockOskService } from './mock-osk.service';
import { RequestDetectUpTrend } from '../model/request-model/detect-up-trend-bp';
import { RequestDetectDownTrendBp } from '../model/request-model/detect-down-trend-bp';
import { RequestDetectContraryTrendsBpAndPulse } from '../model/request-model/detect-contranry-bp';
import { RequestDetectBradycarDia } from '../model/request-model/detect-bradycar-dia';
import { RequestDetectLowBP } from '../model/request-model/detect-low-bp';
@Controller('')
export class MockOskController {
    constructor(private readonly mockOskService: MockOskService) { }

    @Post('/detectUpTrendBP')
    getDetectUpTrendBp(@Body() body: RequestDetectUpTrend) {
        const result = this.mockOskService.getDetectUpTrendBp(body);
        throw new HttpException( result, 200);
    }

    @Post('/detectDownTrendBP')
    async detectDownTrendBP(@Body() body: RequestDetectDownTrendBp) {
        // if (typeof body.data.am !== 'number') {
        //     throw new HttpException({
        //         status: HttpStatus.BAD_REQUEST,
        //         error: 'Parameter must be integer',
        //     }, 400);
        // } else if {
        //        for(let i = 0; i< body.data.am.length; i++){

        //        }
        //     }
        // }
        const result = await this.mockOskService.detectDownTrendBP(body);
        throw new HttpException({ result }, HttpStatus.OK);

    }

    @Post('/detectContraryTrendsBPandPulse')
    async detectContraryTrendsBPandPulse(@Body() body: RequestDetectContraryTrendsBpAndPulse) {
        const result = await this.mockOskService.detectContraryTrendsBPandPulse(body);
        throw new HttpException(result, HttpStatus.OK);
    }

    @Post('/detectBradycardia')
    async detectBradycardia(@Body() body: RequestDetectBradycarDia) {
        const result = await this.mockOskService.detectBradycardia(body);
        throw new HttpException(result, HttpStatus.OK);
    }

    @Post('/detectLowBP')
    async detectLowBP(@Body() body: RequestDetectLowBP) {
        const result = await this.mockOskService.detectLowBP(body);
        throw new HttpException(result, HttpStatus.OK);
    }

}

// export class Problem {
//     public status: number;
//     public type?: string;
//     public title?: string;
//     public detail?: string
//     constructor(values = {}) {
//         Object.assign(this, values)
//     }
// }
