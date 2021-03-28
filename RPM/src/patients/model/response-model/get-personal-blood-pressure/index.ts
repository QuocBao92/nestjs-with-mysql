/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel, Result } from '../../../../models';
import { IsNotEmpty, Length } from 'class-validator';

export class GetPersonalBloodPressure extends BaseModel {

    /**
     * #Item Name: Result
     * #British name: result
     * #Type: object
     */
    public result: Result;

    /**
     * #Item Name: Target systolic blood pressure
     * #British name: target_sys
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public target_sys: number;

    /**
     * #Item Name: Target diastolic blood pressure
     * #British name: target_dia
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public target_dia: number;

    /**
     * #Item Name: Threshold systolic blood pressure
     * #British name: threshold_sys
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public threshold_sys: number;

    /**
     * #Item Name: Threshold diastolic blood pressure
     * #British name: threshold_dia
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public threshold_dia: number;

    /**
     * #Item Name: Systolic blood pressure setting upper limit
     * #British name: sys_max
     * #Type: number
     */
    @IsNotEmpty()
    @Length(999)
    // tslint:disable-next-line:variable-name
    public sys_max: number;

    /**
     * #Item Name: Systolic blood pressure setting lower limit
     * #British name: sys_min
     * #Type: number
     */
    @IsNotEmpty()
    @Length(999)
    // tslint:disable-next-line:variable-name
    public sys_min: number;

    /**
     * #Item Name: Minimum blood pressure setting upper limit
     * #British name: dia_max
     * #Type: number
     */
    @IsNotEmpty()
    @Length(999)
    // tslint:disable-next-line:variable-name
    public dia_max: number;

    /**
     * #Item Name: Minimum blood pressure setting lower limit
     * #British name: dia_min
     * #Type: number
     */
    @IsNotEmpty()
    @Length(999)
    // tslint:disable-next-line:variable-name
    public dia_min: number;
}
