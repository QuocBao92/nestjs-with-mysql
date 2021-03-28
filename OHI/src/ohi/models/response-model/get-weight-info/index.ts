/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { PatientsVitalInformation } from './patients-vital-information';
import { IsNotEmpty } from 'class-validator';
import { Result } from '../base-model/base-result';
import BaseModel from 'src/patient/model/reponse-model/base-model';

export class GetWeightInfo extends BaseModel {

    /**
     * #Item Name: Result
     * #British Name: result
     * #Type: object
     * #Indispensability: true
     */
    @IsNotEmpty()
    public result: Result;

    /**
     * #Item Name: Data
     * #British Name: data
     * #Use Explanation: Array of patient's vital information It sets it in order of id specified by the request parameter.
     * #Type: array
     */
    public data: PatientsVitalInformation[];
}
