import { Module } from '@nestjs/common';
import { MockOskController } from './mock-osk.controller';
import { MockOskService } from './mock-osk.service';

@Module({
  controllers: [MockOskController],
  providers: [MockOskService],
})
export class MockOskModule { }
