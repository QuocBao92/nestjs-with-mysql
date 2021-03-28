import { BadRequestException, Body, Controller, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { IdnProblem } from 'src/common/idn-problem';
import {
    RequestBodyGetPersonalBPInfo, RequestBodySendBPAlert, RequestBodySetPersonalBPInfo,
    RequestGetPersonalInfo, RequestGetTakingMedicineInfo, RequestGetVitalData, RequestHeartAdvisorUserId,
    RequestLatestWeightInfo, RequestPrescriptionInfo, RequestSideEffectInfo, RequestVitalAverageData
} from '../ohi/models/request-model';
import { MockOhiService } from './mock-ohi.service';
import { RequestWeightInfo } from '../ohi/models/request-model/get-weight-info';
import { RequestWeightThreshold } from 'src/ohi/models/request-model/get-weight-threshold';
import { RequestSetWeightThreshold } from 'src/ohi/models/request-model/set-weight-threshold';
import { Request } from 'express';
@Controller('')
export class MockOhiController {
    constructor(private readonly mockOhiService: MockOhiService) { }

    sleep(ms) {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    @Post('getHAID')
    async getHAID(@Body() query: RequestHeartAdvisorUserId): Promise<any | IdnProblem> {

        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getHAID(query);
                throw new HttpException(result, HttpStatus.OK);
        }
    }

    @Post('getPersonalInfo')
    async getPersonalInfo(@Body() query: RequestGetPersonalInfo): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 7;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 2:
                throw new HttpException({
                    status: HttpStatus.TOO_MANY_REQUESTS,
                    error: 'TOO_MANY_REQUESTS'
                }, 429);
            case 3:
                throw new HttpException({
                    status: HttpStatus.TOO_MANY_USER,
                    error: 'TOO_MANY_USER'
                }, 503);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 5:
                throw new HttpException({
                    status: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'SERVICE_UNAVAILABLE'
                }, 503);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getPersonalInfo(query);
                if (!result) {
                    throw new BadRequestException('Invalid user');
                }
                else {
                    // return result;
                    throw new HttpException(result, HttpStatus.OK);
                }
        }

    }

    // @Post('getLatestWeightInfo')
    // async getLatestWeightInfo(@Body() query: RequestLatestWeightInfo): Promise<any | IdnProblem> {
    //     let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
    //     caseRandom = 2;
    //     switch (caseRandom) {
    //         case 1:
    //             throw new HttpException({
    //                 status: HttpStatus.BAD_REQUEST,
    //                 error: 'Bad Request'
    //             }, 400);
    //         case 4:
    //             throw new HttpException({
    //                 status: HttpStatus.UNAUTHORIZED,
    //                 error: 'Unauthorized'
    //             }, 401);
    //         case 8:
    //             throw new HttpException({
    //                 status: HttpStatus.FORBIDDEN,
    //                 error: 'Forbidden'
    //             }, 403);
    //         case 12:
    //             await this.sleep(20000);
    //             throw new HttpException({
    //                 status: HttpStatus.REQUEST_TIMEOUT,
    //                 error: 'Request Timeout'
    //             }, 408);
    //         case 16:
    //             await this.sleep(20000);
    //             throw new HttpException({
    //                 status: HttpStatus.INTERNAL_SERVER_ERROR,
    //                 error: 'Internal Server Error'
    //             }, 500);
    //         default:
    //             const result = await this.mockOhiService.getLatestWeightInfo(query);
    //             if (!result) {
    //                 throw new BadRequestException('Invalid user');
    //             }
    //             else {
    //                 // return result;
    //                 throw new HttpException(result, HttpStatus.OK);
    //             }
    //     }
    // }

    @Post('getWeightInfo')
    async getWeightInfo(@Body() query: RequestWeightInfo): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 9;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 2:
                throw new HttpException({
                    status: HttpStatus.GATEWAY_TIMEOUT,
                    error: 'GATEWAY_TIMEOUT'
                }, 504);
            case 3:
                throw new HttpException({
                    status: HttpStatus.TOO_MANY_USER,
                    error: 'TOO_MANY_USER'
                }, 503);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getWeightInfo(query);
                if (!result) {
                    throw new BadRequestException('Invalid user');
                }
                else {
                    // return result;
                    throw new HttpException(result, HttpStatus.OK);
                }
        }
    }

    @Post('getWeightThreshold')
    async getWeightThreshold(@Body() query: RequestWeightThreshold): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getWeightThreshold(query);
                if (!result) {
                    throw new BadRequestException('Invalid user');
                }
                else {
                    // return result;
                    throw new HttpException(result, HttpStatus.OK);
                }
        }
    }

    @Post('setWeightThreshold')
    async setWeightThreshold(@Body() query: RequestSetWeightThreshold): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.setWeightThreshold(query);
                if (!result) {
                    throw new BadRequestException('Invalid user');
                }
                else {
                    // return result;
                    throw new HttpException(result, HttpStatus.OK);
                }
        }
    }


    @Post('getVitalData')
    async getVitalData(@Body() query: RequestGetVitalData): Promise<any> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getVitalData(query);
                if (!result) {
                    throw new BadRequestException('Invalid user');
                }
                else {
                    // return result;
                    throw new HttpException(result, HttpStatus.OK);
                }
        }

    }

    @Post('getVitalAverageData')
    async getVitalAverageData(@Body() query: RequestVitalAverageData): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getVitalAverageData(query);
                if (!result) {
                    throw new BadRequestException('Invalid user');
                }
                else {
                    // return result;
                    throw new HttpException(result, HttpStatus.OK);
                }
        }
    }

    @Post('getPersonalBPInfo')
    async getPersonalBPInfo(@Body() body: RequestBodyGetPersonalBPInfo): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(20000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getPersonalBPInfo(body);
                throw new HttpException(result, HttpStatus.OK);
        }

    }

    @Post('setPersonalBPInfo')
    async setPersonalBPInfo(@Body() body: RequestBodySetPersonalBPInfo): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.setPersonalBPInfo(body);
                throw new HttpException(result, HttpStatus.OK);
        }
    }

    @Post('sendBPAlert')
    async sendBPAlert(@Body() body: RequestBodySendBPAlert): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.sendBPAlert(body);
                throw new HttpException(result, HttpStatus.OK);
        }
    }

    @Post('getPrescriptionInfo')
    async getPrescriptionInfo(@Body() query: RequestPrescriptionInfo): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getPrescriptionInfo(query);
                throw new HttpException(result, HttpStatus.OK);
        }
    }

    @Post('getTakingMedicineInfo')
    async getTakingMedicineInfo(@Body() query: RequestGetTakingMedicineInfo): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getTakingMedicineInfo(query);
                if (!result) {
                    throw new BadRequestException('Invalid user');
                }
                else {
                    // return result;
                    throw new HttpException(result, HttpStatus.OK);
                }
        }
    }

    @Post('getSideEffectInfo')
    async getSideEffectInfo(@Body() query: RequestSideEffectInfo): Promise<any | IdnProblem> {
        let caseRandom = this.mockOhiService.getRandomInterger(0, 50);
        caseRandom = 2;
        switch (caseRandom) {
            case 1:
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request'
                }, 400);
            case 4:
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized'
                }, 401);
            case 8:
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Forbidden'
                }, 403);
            case 12:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.REQUEST_TIMEOUT,
                    error: 'Request Timeout'
                }, 408);
            case 16:
                await this.sleep(10000);
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error'
                }, 500);
            default:
                const result = await this.mockOhiService.getSideEffectInfo(query);
                if (!result) {
                    throw new BadRequestException('Invalid user');
                }
                else {
                    // return result;
                    throw new HttpException(result, HttpStatus.OK);
                }
        }
    }
}
