/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../models';

export class RequestBodyGetPersonalBPInfo extends BaseModel {
    /**
     * #Item Name: HeartAdvisorUserID
     * #Parameter Name: ha_user_id.
     * #Usage: Set UserID of Heart Advisor
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string[];
}
