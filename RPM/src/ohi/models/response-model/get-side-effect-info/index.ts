/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { InformationOnSideEffect } from './information_on_side_effect';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../../models';
import { Result } from '../base-model/base-result.model';

export class GetSiteEffectInfo extends BaseModel {
    /**
     * #Item Name: Result
     * #British Name: result
     * #Type: object
     * #Indispensability: true
     */
    @IsNotEmpty()
    public result: Result;

    /**
     * #Item Name: HeartAdvisorUserID
     * #British Name: ha_user_id
     * #Use Explanation: HeartAdvisorUserID is set.
     * #Type:  string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * Array of information on side effect generation day It sets it in new day the order.
     */
    // tslint:disable-next-line:variable-name
    public side_effect_info: InformationOnSideEffect[];
}
