/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RequestThresholdModelOHI {

    /**
     * #Item Name: Threshold setting number
     * #British name: id
     * #Type: integer
     * #Use explanation:: Threshold management number 1 or 2
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public id: number;

    /**
     * #Item Name: Effective flag
     * #British name: enabled_flag
     * #Type: integer
     * #Use explanation:: 0:OFF 1:ON
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public enabled_flag: number;

    /**
     * #Item Name: Weight threshold
     * #British name: value
     * #Type: string
     * #Use explanation:: Weight that becomes threshold
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public value: string;

    /**
     * #Item Name: Unit of weight threshold
     * #British name: unit
     * #Type: integer
     * #Use explanation:: 1:"kg" 2:"lbs"
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public unit: number;

    /**
     * #Item Name: Period
     * #British name: period
     * #Type: integer
     * #Use explanation: Day: 1-30
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public period: number;
}
