/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty, Length } from 'class-validator';
import { BaseModel } from '../../../../models';
import { BloodPressure } from './blood-pressure';
import { WeightInformation } from './weight-information';

export class PatientInformation extends BaseModel {

    /**
     * #Item Name: HeartAdvisorUserID
     * #British name: ha_user_id
     * #Type: string
     */
    @IsNotEmpty()
    @Length(64)
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item Name: Rank
     * #British name: rank_total
     * #Type: number.
     * #Use explanation: 0: No rank 1: L, 2: M, 3: MH, 4: H.
     * Display the number of patients of "4: H" on the badge of the blood pressure list tab
     */
    @IsNotEmpty()
    @Length(10)
    // tslint:disable-next-line:variable-name
    public rank_total: number;

    /**
     * #Item Name: Weight threshold excess flag
     * #British name: weight_alert
     * #Type: number.
     */
    @IsNotEmpty()
    @Length(10)
    // tslint:disable-next-line:variable-name
    public weight_alert: number;

    /**
     * #Item Name: Patient ID
     * #British name: mr_id
     * #Type: string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public mr_id: string;

    /**
     * #Item Name: Patient's name
     * #British name: first_name
     * #Type: string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public first_name: string;

    /**
     * #Item Name: Patient's middle name
     * #British name: middle_name
     * #Type: string
     */
    // tslint:disable-next-line:variable-name
    public middle_name: string;

    /**
     * #Item Name: Patient's last name
     * #British name: last_name
     * #Type: string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public last_name: string;

    /**
     * #Item Name: Gender
     * #British name: gender
     * #Type: number
     * #Use explanation: 1:Man 2: Woman
     */
    @IsNotEmpty()
    @Length(2)
    public gender: number;

    /**
     * #Item Name: Age
     * #British name: age
     * #Type: number
     */
    @IsNotEmpty()
    public age: number;

    /**
     * #Item Name: Blood pressure information
     * #British name: pressure
     * #Type: object
     */
    public pressure: BloodPressure;

    /**
     * #Item Name: Weight information
     * #British name: weight
     * #Type: object
     */
    public weight: WeightInformation;
}
