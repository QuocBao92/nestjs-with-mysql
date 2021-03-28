/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Module } from '@nestjs/common';
import { SsoController } from './sso.controller';
import { SsoService } from './sso.service';
import { TableSession } from './entity/table_session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingInfo } from '../setting/entity/setting-info.entity';
import { SettingModule } from '../setting/setting.module';
import { OhiModule } from '../ohi/ohi.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TableSession, SettingInfo]),
    SettingModule,
    OhiModule,
  ],
  controllers: [SsoController],
  providers: [SsoService],
  exports: [SsoService],
})
export class SsoModule { }
