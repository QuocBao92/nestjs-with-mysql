/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';
import { IsNotEmpty } from 'class-validator';

export class BaseRequest extends BaseModel {
    /**
     * #Item name: HeartAdvisorUserID
     * #Use explanation: UserID of Heart Advisor is specified.
     * #Type: string.
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item name: Acquisition beginning date
     * #Type: date(ISO8601 format)
     * #Development explanation: Time specifies 00:00:00.
     * #Use explanation: The beginning date of the acquisition period is specified.
     */
    @ApiModelProperty({required: false})
    public start: Date;

    /**
     * #Item name: Acquisition end date
     * #Type: date(ISO8601 format)
     * #Development explanation: Time specifies 23:59:59.
     * #Use explanation: The end date of the acquisition period is specified.
     */
    @ApiModelProperty({required: false})
    public end: Date;
}
