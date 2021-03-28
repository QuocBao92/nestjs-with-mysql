/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthorizationMiddleware } from './authorization.middleware';
import { OhiModule } from '../ohi/ohi.module';
import { PatientAggregate } from './entity/patient-aggregate.entity';
import { PatientAggregateDaily } from './entity/patient-aggregate-daily.entity';
import { PatientBloodPressureDetailService } from './patient-blood-pressure-detail.service';
import { PatientCommonDetailService } from './patient-common-detail-service';
import { PatientContract } from './entity/patient-contract.entity';
import { PatientController } from './patient.controller';
import { PatientListService } from './patient-list.service';
import { PatientPersonalBpService } from './patient-personal-blood-pressure.service';
import { SettingInfo } from '../setting/entity/setting-info.entity';
import { SettingModule } from '../setting/setting.module';
import { SettingService } from '../setting/setting.service';
import { SsoModule } from '../sso/sso.module';
import { SsoService } from '../sso/sso.service';
import { TableSession } from '../sso/entity/table_session.entity';
import { TempPatientAggregate } from './entity/temp_patient_aggregate.entity';
import { TempPatientAggregateDaily } from './entity/temp_patient_aggregate_daily.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateHaidService } from './update-haid.service';
import { ConfirmSessionService } from './confirm-session.service';
import { MedicalTime } from './entity/medical-time.entity';
import { MedicalTimeService } from './medical-time.service';
import { PatientWeightDetailService } from './patient-weight-detail.service';
import { PatientWeightThresholdService } from './patient-weight-threshold.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientAggregate,
      PatientContract,
      PatientAggregateDaily,
      TableSession,
      SettingInfo,
      TempPatientAggregate,
      TempPatientAggregateDaily,
      MedicalTime,
    ]),
    OhiModule,
    SsoModule,
    SettingModule,
  ],
  providers: [
    PatientCommonDetailService,
    PatientBloodPressureDetailService,
    PatientListService,
    PatientPersonalBpService,
    SsoService,
    SettingService,
    UpdateHaidService,
    ConfirmSessionService,
    MedicalTimeService,
    PatientWeightDetailService,
    PatientWeightThresholdService,
  ],
  controllers: [PatientController],
})

export class PatientModule implements NestModule {
  configure(userContext: MiddlewareConsumer) {
    userContext.apply(AuthorizationMiddleware)
      .exclude({ path: '/dashboard/confirmSession', method: RequestMethod.POST })
      .forRoutes(PatientController);
  }
}
