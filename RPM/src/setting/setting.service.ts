/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblemException } from '../common';
import { SettingInfo } from './entity/setting-info.entity';

@Injectable()
export class SettingService {
    /**
     * Constructor of Setting Service
     * @param settingInfoRepository Repository<SettingInfo>
     */
    constructor(
        @InjectRepository(SettingInfo)
        private readonly settingInfoRepository: Repository<SettingInfo>,
    ) {

    }

    /**
     * getValueByKey
     * @param setting_key string
     */
    // tslint:disable-next-line:variable-name
    async getValueByKey(setting_key: string): Promise<string> {
        // Get setting value from table `m_setting_info` by setting_key
        // tslint:disable-next-line:prefer-const
        let result = await this.settingInfoRepository.findOneOrFail({
            select: ['setting_value'],
            where: [{ setting_key }],
        });
        return (result as SettingInfo).setting_value;
    }
    /**
     * Get value by many keys in once
     * @param settingKeys: array
     */
    async getValueByKeys(settingKeys: string[]): Promise<SettingInfo[] | ProblemException> {

        try {
            const keys = settingKeys.map(key => {
                return {
                    setting_key: key,
                };
            });

            const result = await this.settingInfoRepository.find({
                select: ['setting_key', 'setting_value'],
                where: keys,
            });
            return result;
        } catch (ex) {
            return new ProblemException();
        }
    }
}
