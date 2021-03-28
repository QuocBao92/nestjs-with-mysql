/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { PatientsThresholdInformation } from './patients-threshold-information';
import BaseModel from 'src/model/base-model';
import { Result } from '../base-model';

export class GetWeightThreshold extends BaseModel {

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
     * #Type: array
     */
    // tslint:disable-next-line:variable-name
    public threshold_info: PatientsThresholdInformation[];
}
