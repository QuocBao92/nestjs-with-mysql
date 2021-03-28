/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingInfo } from '../setting/entity/setting-info.entity';
import { SettingModule } from '../setting/setting.module';
import { SettingService } from '../setting/setting.service';
import { OhiService } from './ohi.service';
import { Requester } from '../common';

@Module({
    imports: [
        TypeOrmModule.forFeature([SettingInfo]),
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        SettingModule,

    ],
    providers: [ OhiService, SettingService, Requester],
    exports: [OhiService],
})
export class OhiModule { }
