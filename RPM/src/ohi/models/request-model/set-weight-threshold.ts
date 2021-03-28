/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';
import { IsNotEmpty } from 'class-validator';
import { RequestThresholdModelOHI } from './set-weight-threshold-model';

export class RequestSetWeightThresholdOHI extends BaseModel {

    /**
     * #Item Name: ha_user_id
     * #Type: string
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public ha_user_id: string;

    /**
     * #Item Name: Threshold
     * #Type: Array[object]
     */
    @ApiModelProperty()
    public threshold: RequestThresholdModelOHI[];
}
