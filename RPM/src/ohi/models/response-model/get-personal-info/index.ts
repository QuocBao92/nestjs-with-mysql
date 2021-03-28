/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../../models';
import { Result } from '../base-model/base-result.model';
import { PatientInformation } from './patient-information';
import { IsNotEmpty } from 'class-validator';
export class GetPersonalInfoModel extends BaseModel {

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
     * #Use Explanation: Array of patient information It sets it in order of id specified by the request parameter.
     * #Type: Array[object]
     */
    public data: PatientInformation[];
}
