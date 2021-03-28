import { Module } from '@nestjs/common';
import { MockOhiService } from './mock-ohi.service';
import { MockOhiController } from './mock-ohi.controler';
import { CacheService } from '../cache/cache.service';
import { CacheModule } from '../cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OhiCache } from '../cache/entity';

@Module({
    providers: [MockOhiService, CacheService],
    controllers: [MockOhiController],
    imports: [CacheModule, TypeOrmModule.forFeature([OhiCache]),]
})
export class MockOhiModule { }
