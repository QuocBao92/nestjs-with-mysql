/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty, Min, Max } from 'class-validator';
import BaseModel from 'src/model/base-model';

export class InitialThreshold extends BaseModel {

    /**
     * #Item Name: Threshold ID
     * #Use Explanation: Set the threshold control number for each patient
     * #Type: integer
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public id: number;

    /**
     * #Item Name: Valid Flag
     * #Use Explanation: Set a flag that is valid for weight threshold judgment 0:OFF 1:ON
     * #Type: integer
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public enabled_flag: number;

    /**
     * #Item Name: Weight Threshold(kg)
     * #Use Explanation: Set the weight as the threshold of unit Kg
     * #Type: string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public threshold_kg: string;

    /**
     * #Item Name: Weight Threshold(lbs)
     * #Use Explanation: Set weight threshold for pounds unit
     * #Type: string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public threshold_lbs: string;

    /**
     * #Item Name: Period
     * #Use Explanation: Set the weight threshold judgment period in days
     * #Type: integer
     */
    @IsNotEmpty()
    @Min(1)
    @Max(30)
    // tslint:disable-next-line:variable-name
    public period: number;
}
