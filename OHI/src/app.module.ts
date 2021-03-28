import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { MockOhiModule } from './mock-ohi/mock-ohi.module';
import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { PatientModule } from './patient/patient.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './config/database.module';

@Module({
  imports: [
    ConfigModule.register(),
    DatabaseModule,
    MockOhiModule,
    PatientModule,
    CacheModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule { }
