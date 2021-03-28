/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';

export class RequestThresholdInformation extends BaseModel {

    /**
     * #Item Name: Threshold setting number
     * #British name: id
     * #Type: integer
     * #Use explanation:: Threshold management number 1 or 2
     */
    @ApiModelProperty()
    public id: number;

    /**
     * #Item Name: Effective flag
     * #British name: enabled_flag
     * #Type: integer
     * #Use explanation:: 0:OFF 1:ON
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public enabled_flag: number;

    /**
     * #Item Name: Weight threshold
     * #British name: value
     * #Type: number
     * #Use explanation:: Weight that becomes threshold
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public value: number;

    /**
     * #Item Name: Unit of weight threshold
     * #British name: unit
     * #Type: number
     * #Use explanation:: 1:"kg" 2:"lbs"
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public unit: number;

    /**
     * #Item Name: Period
     * #British name: period
     * #Type: number
     * #Use explanation: Day: 1-30
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public period: number;
}
