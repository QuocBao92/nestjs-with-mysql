/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientAggregate } from '../patients/entity/patient-aggregate.entity';
import { PatientContract } from '../patients/entity/patient-contract.entity';
import { SettingInfo } from '../setting/entity/setting-info.entity';
import { SettingService } from '../setting/setting.service';
import { ForesightController } from './foresight.controller';
import { ForesightMiddleware } from './foresight.middleware';
import { ForesightService } from './foresight.service';
import { MedicalTime } from '../patients/entity/medical-time.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientContract,
      // PatientWeightThreshold,
      PatientAggregate,
      SettingInfo,
      MedicalTime,
    ]),
  ],
  providers: [ForesightService, SettingService],
  controllers: [ForesightController],
  exports: [ForesightService],
})

export class ForesightModule implements NestModule {
  configure(userContext: MiddlewareConsumer) {
    userContext.apply(ForesightMiddleware)
      .forRoutes(ForesightController);
  }
}
