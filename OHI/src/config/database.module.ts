import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigModule } from './config.module';

async function DatabaseOrmModule(): Promise<DynamicModule> {

    const environment = process.env.NODE_ENV || 'dev';
    const envFile = path.resolve(__dirname, '../../../config', `${environment}.env`);
    const envConfig = dotenv.parse(fs.readFileSync(envFile));

    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    });

    return TypeOrmModule.forRoot({
        type: 'mysql',
        database: process.env.DB_NAME || 'ohi_cache', // 'ohi_cache',
        host: process.env.DB_HOST || '192.168.1.116', // '192.168.1.116',
        port: +process.env.DB_PORT || 3306, // 3306,
        username: process.env.DB_USER || 'idn-user', // 'idn-user',
        password: process.env.DB_PASSWORD || 'Idn@123', // 'Idn@123',
        entities: [__dirname + '../../../**/*.entity{.ts,.js}'],
        synchronize: true,
    });
}

@Global()
@Module({
    imports: [ConfigModule.register(), DatabaseOrmModule()],
})
export class DatabaseModule { }
