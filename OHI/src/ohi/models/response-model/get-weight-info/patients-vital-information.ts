/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseDataItemModel } from '../base-model';
import { IsNotEmpty, Min, Max } from 'class-validator';

export class PatientsVitalInformation extends BaseDataItemModel {

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
     * #Type: string - Spoch timestamp
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public latest_date: number;

    /**
     * #Item Name: Latest measurement time zone
     * #Use Explanation: The time zone of the measurement date is set.
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public latest_timezone: string;

    /**
     * #Item Name: Latest weight (kg)
     * #Use Explanation: The weight of unit kg is set.
     * #Type: integer
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public latest_weight_kg: string;

    /**
     * #Item Name: Weight (lbs)
     * #Use Explanation: The weight of unit kg is set.
     * #Type: integer
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public latest_weight_lbs: string;

    /**
     * #Item Name: weight_alert
     * #Use Explanation: Presence or absence of overweight threshold alert
     * #Type: integer
     * #Indispensability: true
     */
    @IsNotEmpty()
    @Min(0)
    @Max(2)
    // tslint:disable-next-line:variable-name
    public weight_alert: number;

    /**
     * #Item Name: last_weight_meas_date
     * #Use Explanation: Weight data last measurement date
     * #Type: Date
     * #Indispensability: false
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public last_weight_meas_date: Date;

    /**
     * #Item Name: before_date
     * #Use Explanation: Weight threshold exceeded alert: Date before change
     * #Type: Epoch timestamp
     * #Indispensability: false
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public before_date: number;

    /**
     * #Item Name: before_timezone
     * #Use Explanation: Weight threshold exceeded alert: time zone before change
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public before_timezone: string;

    /**
     * #Item Name: before_weight_kg
     * #Use Explanation: Weight threshold exceeded alert: Weight before change (kg)
     * #Type: string
     * #Indispensability: false
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public before_weight_kg: string;

    /**
     * #Item Name: before_weight_lbs
     * #Use Explanation: Weight threshold exceeded alert: Weight before change (lbs)
     * #Type: string
     * #Indispensability: false
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public before_weight_lbs: string;

    /**
     * #Item Name: after_date
     * #Use Explanation: Weight threshold exceeded alert: Date and time after change
     * #Type: Epoch timestamp
     * #Indispensability: false
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public after_date: number;

    /**
     * #Item Name: after_timezone
     * #Use Explanation: Weight threshold exceeded alert: Time zone after change
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public after_timezone: string;

    /**
     * #Item Name: after_weight_kg
     * #Use Explanation: Weight threshold exceeded alert: Weight after change (kg)
     * #Type: string
     * #Indispensability: false
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public after_weight_kg: string;

    /**
     * #Item Name: after_weight_lbs
     * #Use Explanation: Weight threshold exceeded alert: Weight after change (lbs)
     * #Type: string
     * #Indispensability: false
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public after_weight_lbs: string;

    /**
     * #Item Name: threshold_kg
     * #Use Explanation: Weight Threshold Exceeded Alert: Threshold setting: Threshold: kg
     * #Type: string
     * #Indispensability: false
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public threshold_kg: string;

    /**
     * #Item Name: threshold_lbs
     * #Use Explanation: Weight Threshold Exceeded Alert: Threshold setting: Threshold: Pound
     * #Type: string
     * #Indispensability: false
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public threshold_lbs: string;

    /**
     * #Item Name: threshold_period
     * #Use Explanation: Weight Threshold Exceeded Alert: Threshold setting: Duration
     * #Type: integer
     * #Indispensability: false
     */
    @IsNotEmpty()
    @Min(0)
    @Max(30)
    // tslint:disable-next-line:variable-name
    public threshold_period: number;
}
