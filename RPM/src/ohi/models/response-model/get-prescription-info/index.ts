/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../../models';
import { Result } from '../base-model/base-result.model';
import { MedicinesInformation } from './medicines-information';

export class GetPrescriptionInfo extends BaseModel {
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
     * #Type: string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * Array of medicine information
     */
    public medicines: MedicinesInformation[];
}
