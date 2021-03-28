/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel, Result } from '../../../../models';
import { PatientInformationWeight } from './patient-information-weight';

export class WeightDetail extends BaseModel {

    /**
     * #Item Name: Result
     * #British name: result
     * #Type: object
     */
    public result: Result;

    /**
     * #Item Name: Weight information array
     * #British name: weight_data
     * #Type: Array[object]
     */
    // tslint:disable-next-line:variable-name
    public weight_data: PatientInformationWeight[];
}
