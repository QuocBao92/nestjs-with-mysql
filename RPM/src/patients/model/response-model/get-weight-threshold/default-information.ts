/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty, Length } from 'class-validator';
import { BaseModel } from '../../../../models';

export class DefaultInformation extends BaseModel {

    /**
     * #Item Name: Threshold setting number
     * #British Name: id
     * #Type: number
     * #Indispensability: true
     */
    @IsNotEmpty()
    public id: number;

    /**
     * #Item Name: Valid flag
     * #British Name: enabled_flag
     * #Type: number
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public enabled_flag: number;

    /**
     * #Item Name: Weight threshold (kg)
     * #British Name: threshold_kg
     * #Type: number
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public threshold_kg: number;

    /**
     * #Item Name: Weight threshold (lbs)
     * #British Name: threshold_lbs
     * #Type: number
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public threshold_lbs: number;

    /**
     * #Item Name: Period
     * #British Name: period
     * #Type: number
     * #Indispensability: true
     * #Use explanation: Day: 1-30
     */
    @IsNotEmpty()
    @Length(99)
    // tslint:disable-next-line:variable-name
    public period: number;
}
