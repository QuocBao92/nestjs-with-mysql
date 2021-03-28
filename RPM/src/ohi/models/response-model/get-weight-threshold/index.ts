/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../../models';
import { Result } from '../base-model/base-result.model';
import { IsNotEmpty } from 'class-validator';
import { PatientsThresholdInformation } from './patients-threshold-information';

export class GetWeightThresholdOHI extends BaseModel {

    /**
     * #Item Name: Result
     * #British Name: result
     * #Type: object
     * #Indispensability: true
     */
    @IsNotEmpty()
    public result: Result;

    /**
     * #Item Name: Weight threshold information
     * #British Name: threshold_info
     * #Use Explanation: Array of weight threshold information for each patient
     * #Type: Array[object]
     */
    // tslint:disable-next-line:variable-name
    public threshold_info: PatientsThresholdInformation[];
}
