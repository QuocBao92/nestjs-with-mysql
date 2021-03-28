/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { VitalDataAverage } from './vital-data-average';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../../models';
import { Result } from '../base-model/base-result.model';

export class GetVitalAverageData extends BaseModel {
    /**
     * #Item Name: Result
     * #British Name: result
     * #Type: object
     * #Indispensability: true
     */
    @IsNotEmpty()
    public result: Result;

    /**
     * #Item Name: HeartAdvisorUserID
     * #British Name: ha_user_id
     * #Use Explanation: HeartAdvisorUserID is set.
     * #Type:  string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Name: Vital data (Blood Pressure).
     * #Usage: Set in descending order of Measurement date (new to old).
     */
    // tslint:disable-next-line:variable-name
    public vital_data: VitalDataAverage[];
}
