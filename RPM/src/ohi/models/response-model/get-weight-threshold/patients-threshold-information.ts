/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseDataItemModel } from '../base-model';
import { IsNotEmpty } from 'class-validator';
import { ThresholdInformation } from './threshold-model';
import { InitialThreshold } from './initial-threshold-model';

export class PatientsThresholdInformation extends BaseDataItemModel {

    /**
     * #Item Name: HeartAdvisorUserID
     * #Use Explanation: UserID of Heart Advisor is set.
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item Name: Threshold
     * #Use Explanation: Set weight threshold information
     * #Type: Array[object]
     */
    // tslint:disable-next-line:variable-name
    public threshold: ThresholdInformation[];

    /**
     * #Item Name: Initial Threshold
     * #Use Explanation: Set parameters for resetting weight threshold settings
     * #Type: Array[object]
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public init: InitialThreshold[];
}
