/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../models';
import { ApiModelProperty } from '@nestjs/swagger';

export class RequestGetPersonalInfo extends BaseModel {

    /**
     * #Item Name: HeartAdvisorUserID.
     * #Parameter Name: ha_user_id.
     * #Type: Array[string]
     * #Usage: Set UserID of Heart Advisor.
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string[];

}
