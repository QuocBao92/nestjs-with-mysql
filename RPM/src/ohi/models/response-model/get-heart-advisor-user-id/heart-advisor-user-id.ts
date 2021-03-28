/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseDataItemModel } from '../base-model';
import { IsNotEmpty } from 'class-validator';

export class HeartAdvisorUserID extends BaseDataItemModel {
    /**
     * #Item Name: HeartAdvisorUserID
     * #British Name: ha_user_id
     * #Use Explanation: HeartAdvisorUserID is set.
     * #Type:  string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;
}
