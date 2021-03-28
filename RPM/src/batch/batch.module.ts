/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempPatientAggregate } from '../patients/entity/temp_patient_aggregate.entity';
import { TempPatientAggregateDaily } from '../patients/entity/temp_patient_aggregate_daily.entity';
import { TableSession } from '../sso/entity/table_session.entity';
import { OhiModule } from '../ohi/ohi.module';
import { OhiService } from '../ohi/ohi.service';
import { PatientAggregateDaily } from '../patients/entity/patient-aggregate-daily.entity';
import { PatientAggregate } from '../patients/entity/patient-aggregate.entity';
import { SettingInfo } from '../setting/entity/setting-info.entity';
import { SettingModule } from '../setting/setting.module';
import { SettingService } from '../setting/setting.service';
import { BatchService } from './batch.service';
import { Requester } from '../common';
import { PatientContract } from '../patients/entity/patient-contract.entity';
import { CallBatchController } from './batch.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientAggregate,
      PatientContract,
      PatientAggregateDaily,
      SettingInfo,
      TempPatientAggregateDaily,
      TempPatientAggregate,
      TableSession,
    ]),
    OhiModule,
    SettingModule,
  ],
  providers: [
    BatchService,
    OhiService,
    SettingService,
    Requester,
  ],
  controllers: [CallBatchController],
  exports: [],
})
export class BatchModule { }
