/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Module } from '@nestjs/common';
import { BatchModule } from './batch/batch.module';
import { DatabaseModule } from './config/database.module';
import { ForesightModule } from './foresight/foresight.module';
import { OhiModule } from './ohi/ohi.module';
import { PatientModule } from './patients/patient.module';
import { SettingModule } from './setting/setting.module';
import { SsoModule } from './sso/sso.module';
import { AliveController } from './alive/alive.controller';

@Module({
  imports: [
    DatabaseModule,
    PatientModule,
    BatchModule,
    OhiModule,
    SsoModule,
    ForesightModule,
    SettingModule,
  ],
  controllers: [AliveController],
  providers: [
  ],
})
export class AppModule { }
