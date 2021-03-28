import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OhiCache } from './entity';

@Injectable()
export class CacheService {
    constructor(
        @InjectRepository(OhiCache)
        private readonly ohiCacheRepository: Repository<OhiCache>,
    ) {

    }

    /**
     * SaveContentToCache to database
     * @param apiName API Name
     * @param dataRespone OHI respone success string
     * @param parameters string[] : array paramenters when call OHI api
     * @param token string : token access
     */
    async SaveContentToCache(apiName: string, dataRespone: string, parameters: string[]) {
        let p = '';
        // each paramenter | to distinguish
        parameters.forEach(element => {
            p = p + '|' + element;
        });
        const cacheObj = new OhiCache();
        cacheObj.api_name = apiName;
        cacheObj.parameters = p;
        cacheObj.respone_data = dataRespone; // set respone ohi success
        this.ohiCacheRepository.save(cacheObj); // save to database
    }

    /**
     * GetContentFromCache
     * @param apiName api name
     * @param parameters list parameter call OHI
     * @param token : token
     */
    async GetContentFromCache(apiName: string, parameters: string[]): Promise<string> {
        let p = '';
         // each parameter | to distinguish
        parameters.forEach(element => {
            p = p + '|' + element;
        });
        // find cache from database by token api name and list parameter
        const result = await this.ohiCacheRepository.find({
            where: [{
                api_name: apiName,
                parameters: p,
            }],
        });
        if (result.length === 0) {
            return null; // if not found cache return null
        }
        return await result[0].respone_data; // get newest cache
    }
}
