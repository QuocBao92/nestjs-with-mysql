/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../../models';
import { Result } from '../base-model/base-result.model';
import { TakeDateInfo } from './take-date-info';

export class GetTakingMedicineInfo extends BaseModel {

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
     * #Type: string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item Name: Taking medicine date information
     * #Parameter Name: take_date_info.
     * #Usage: Array of Taking medicine date. Set in descending order of Mesurement date (new to old)
     */
    // tslint:disable-next-line:variable-name
    public take_date_info: TakeDateInfo[];
}
