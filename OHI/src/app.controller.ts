import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import Rank from './common/rank';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return '';
  }
}
