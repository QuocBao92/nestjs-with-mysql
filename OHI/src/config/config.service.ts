import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';
import * as path from 'path';

export type EnvConfig = Record<string, string>;

export interface EnvData {
  // application
  APP_ENV: string;
  APP_DEBUG: boolean;

  // database
  DB_TYPE: 'mysql';
  DB_HOST?: string;
  DB_NAME: string;
  DB_PORT?: number;
  DB_USER: string;
  DB_PASSWORD: string;
}

export class ConfigService {
  private vars: EnvData;
  private readonly envConfig: EnvConfig;

  constructor() {
    const environment = process.env.NODE_ENV || 'dev';
    const envFile = path.resolve(__dirname, '../../../config/', `${environment}.env`);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));

    const data: any = this.envConfig;
    data.APP_ENV = environment;
    data.APP_DEBUG = data.APP_DEBUG === 'true' ? true : false;
    data.DB_PORT = data.DB_PORT;

    this.vars = data as EnvData;
  }

  get isApiAuthEnabled(): boolean {
    return Boolean(this.envConfig.API_AUTH_ENABLED);
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  read(): EnvData {
    if (this.vars.DB_HOST !== undefined) {
      return this.vars;
    }
    if (process.env.DB_HOST !== undefined && process.env.DB_NAME !== undefined && process.env.DB_PORT !== undefined) {
      return {
        DB_TYPE: process.env.DB_TYPE,
        DB_HOST: process.env.DB_HOST,
        DB_NAME: process.env.DB_NAME,
        DB_PORT: +(process.env.DB_PORT),
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD
      } as EnvData;
    }
  }
}
