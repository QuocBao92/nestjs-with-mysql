/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../../models';
import { Result } from '../base-model/base-result.model';
import { VitalInformationBlood } from './vital-information-blood';
import { VitalInformationWeight } from './vital-information-weight';

export class GetVitalDataModel extends BaseModel {

    /**
     * #Item Name: Result
     * #British Name: result
     * #Type: object
     * #Indispensability: true
     */
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
     * #Item Name: Vital information (blood pressure)
     * #British Name: vital_data_blood
     * #Use Explanation: Array of vital information on individual patient who sets it for "Blood pressure" acquisition data type
     *                   It sets it to the reverse chronological order on the measurement day.
     * #Type: Array[object]
     */
    // tslint:disable-next-line:variable-name
    public vital_data: VitalInformationBlood[] | VitalInformationWeight[];

    /**
     * #Item Name: HA server API request receipt date
     * #British Name: ha_request_at
     * #Use Explanation: API request receipt date of the HA server is set.
     * #Type: string - epoch timestamp
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_request_at: number;
}
