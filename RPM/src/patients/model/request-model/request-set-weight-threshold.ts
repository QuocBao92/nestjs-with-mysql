/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { RequestThresholdInformation } from './weight-threshold-infor';
import { BaseModel } from '../../../models';

export class RequestSetWeightThreshold extends BaseModel {

    /**
     * #Item Name: Threshold
     * #Type: Array[object]
     */
    @ApiModelProperty()
    public threshold: RequestThresholdInformation[];
}
