/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingInfo } from '../setting/entity/setting-info.entity';
import { SettingModule } from '../setting/setting.module';
import { SettingService } from '../setting/setting.service';
import { AlgoService } from './algo.service';
import { Requester } from '../common';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingInfo]),
    SettingModule,
  ],
  providers: [AlgoService, SettingService, Requester],
  exports: [AlgoService],
})
export class AlgoModule { }
