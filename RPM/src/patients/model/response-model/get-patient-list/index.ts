/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { PatientInformation } from './patient-information';
import { IsNotEmpty, Length } from 'class-validator';
import { BaseModel, Result } from '../../../../models';
export class PatientList extends BaseModel {

    /**
     * #Item Name: Result
     * #British name: result
     * #Type: object
     */
    @IsNotEmpty()
    public result: Result;

    /**
     * #Item Name: Screen type
     * #British name: data_type
     * #Type: number.
     * #Use explanation: 1:Blood pressure list. 2:Weight list
     */
    @IsNotEmpty()
    @Length(2)
    // tslint:disable-next-line:variable-name
    public data_type: number;

    /**
     * #Item Name: Patient information array
     * #British name: patient_data
     * #Type: Array[object].
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public patient_data: PatientInformation[];
}
