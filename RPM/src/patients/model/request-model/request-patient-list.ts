/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';

export class RequestPatientList extends BaseModel {

    /**
     * #Item name: Screen type
     * #British name: type
     * #Type: number
     * #Use explanation: 1:Patient list (blood pressure). 2:Patient list (weight)
     */
    @ApiModelProperty()
    public type: number;
}
