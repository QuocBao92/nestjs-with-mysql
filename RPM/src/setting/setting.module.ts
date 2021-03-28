/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingInfo } from './entity/setting-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingInfo])],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule { }
