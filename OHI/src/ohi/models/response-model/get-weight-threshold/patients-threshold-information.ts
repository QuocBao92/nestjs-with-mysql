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
     * #Item Name: Latest measurement date
     * #Use Explanation: The measurement date is set.
     * #Type: array
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public threshold: ThresholdInformation[];

    /**
     * #Item Name: Latest measurement time zone
     * #Use Explanation: The time zone of the measurement date is set.
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public init: InitialThreshold[];
}
