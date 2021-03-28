/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';
import { IsNotEmpty } from 'class-validator';

export class RequestSetPersonalBloodPressure extends BaseModel {
    /**
     * #Item Name: Target systolic blood pressure
     * #British Name: target_sys
     * #Type: integer
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public target_sys: number;

    /**
     * #Item Name: Target diastolic blood pressure
     * #British Name: target_dia
     * #Type: integer
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public target_dia: number;

    /**
     * #Item Name: Threshold systolic blood pressure
     * #British Name: threshold_sys
     * #Type: integer
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public threshold_sys: number;

    /**
     * #Item Name: Threshold diastolic blood pressure
     * #British Name: threshold_dia
     * #Type: integer
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public threshold_dia: number;
}
