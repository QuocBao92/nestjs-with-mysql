/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('alive')
export class AliveController {
    @Get('check')
    get(): string {
        throw new HttpException(undefined, HttpStatus.OK);
    }
}
