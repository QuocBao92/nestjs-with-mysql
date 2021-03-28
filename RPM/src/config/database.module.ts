/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

async function DatabaseOrmModule(): Promise<DynamicModule> {

  const environment = process.env.NODE_ENV;
  const envFile = path.resolve(__dirname, '../../../config', `${environment}.env`);
  const envConfig = dotenv.parse(fs.readFileSync(envFile));

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });

  return TypeOrmModule.forRoot({
    type: 'mysql',
    entities: [__dirname + '../../../**/*.entity{.ts,.js}'],
    synchronize: true,
    replication: {
      master: {
        host: process.env.RDS_HOST,
        port: +process.env.RDS_PORT,
        database: process.env.RDS_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
      slaves: [
        {
          host: process.env.RDS_READ_HOST,
          port: +process.env.RDS_READ_PORT,
          database: process.env.RDS_READ_NAME,
          username: process.env.DB_READ_USER,
          password: process.env.DB_READ_PASSWORD,
        },
      ],
    },
  });
}

@Global()
@Module({
  imports: [DatabaseOrmModule()],
})
export class DatabaseModule { }
