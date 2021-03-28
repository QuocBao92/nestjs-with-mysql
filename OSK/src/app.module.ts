import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MockOskModule } from './mock-osk/mock-osk.module';

@Module({
  imports: [MockOskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
