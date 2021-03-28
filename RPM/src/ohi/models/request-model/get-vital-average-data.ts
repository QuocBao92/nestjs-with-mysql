/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseRequest } from './base-request';

export class RequestGetVitalAverageData extends BaseRequest {

    /**
     * #Name: Acquisition quantity
     * #Parameter Name: count.
     * #Type: number
     */
    @ApiModelProperty({ required: false })
    public count: number;
}
