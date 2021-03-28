/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../models';

export class RequestGetWeightThreshold extends BaseModel {
    /**
     * #Item name: HeartAdvisorUserID
     * #Type: Array[string]
     * #Use explanation: UserID of Heart Advisor is specified.
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string[];
}
