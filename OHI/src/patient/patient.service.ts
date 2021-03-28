import { Injectable, Body, Query, Param } from '@nestjs/common';
import { RequestRegister } from './model/request-model/request-register';
import * as config from './config.json';
import { Helper, Requester } from '../common';

@Injectable()
export class PatientService {
    async registerUser(@Body() body: RequestRegister): Promise<any> {
        const url = `${config.rpm_api}/foresight/registerUser`;
        return await Requester.post(url, body);
    }

    async delete(@Body() body: RequestRegister): Promise<any> {
        const url = `${config.rpm_api}/foresight/unregisterUser`
        return await Requester.put(url,body);
    }
} 