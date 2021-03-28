import { Controller, Post, Body, Delete, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { RequestRegister } from './model/request-model/request-register';

@Controller('patient')
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    @Post('/registerUser')
    async registerUser(@Body() body: RequestRegister): Promise<any>{
        return await this.patientService.registerUser(body);
    }

    @Delete('/unregisterUser')
    async unregisterUser(@Body() body: RequestRegister): Promise<any> {
        return await this.patientService.delete(body);
    }
}
