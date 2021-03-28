import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OhiCache } from './entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        OhiCache,
    ])],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule { }
