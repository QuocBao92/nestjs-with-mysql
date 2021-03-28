/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel, Result } from '../../../../models';
import { IsNotEmpty, Length } from 'class-validator';

export class CommonDetail extends BaseModel {

    /**
     * #Item Name: Result
     * #British name: result
     * #Type: object
     */
    @IsNotEmpty()
    public result: Result;

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
     * #Item Name: Date of birth
     * #British name: birthday
     * #Type: string
     * #Use explanation:: It offers it in the form of "YYYY-MM-DD".
     */
    @IsNotEmpty()
    public birthday: string;

    /**
     * #Item Name: Age
     * #British name: age
     * #Type: number
     */
    @IsNotEmpty()
    @Length(999)
    public age: number;

    /**
     * #Item Name: Phone Number
     * #British name: Phone Number
     * #Type: string
     */
    // tslint:disable-next-line: variable-name
    public phone_number: string;

    /**
     * #Item Name: Systolic blood pressure morning average
     * #British name: morning_sys_latest
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public morning_sys_latest: number;

    /**
     * #Item Name: Diastolic morning average
     * #British name: morning_dia_latest
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public morning_dia_latest: number;

    /**
     * #Item Name: Pulse morning average
     * #British name: morning_pulse_latest
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public morning_pulse_latest: number;

    /**
     * #Item Name: Systolic blood pressure evening average
     * #British name: evening_sys_latest
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public evening_sys_latest: number;

    /**
     * #Item Name: Diastolic evening average
     * #British name: evening_dia_latest
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public evening_dia_latest: number;

    /**
     * #Item Name: Pulse night average
     * #British name: evening_pulse_latest
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public evening_pulse_latest: number;

    /**
     * #Item Name: Target systolic blood pressure
     * #British name: sys_target
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public sys_target: number;

    /**
     * #Item Name: Target diastolic blood pressure
     * #British name: dia_target
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public dia_target: number;

    /**
     * #Item Name: Latest weight (kg)
     * #British name: weight_kg
     * #Type: number
     */
    // tslint:disable-next-line:variable-name
    public weight_kg: number;

    /**
     * #Item Name: Latest weight (lbs)
     * #British name: weight_lbs
     * #Type: number
     */
    // tslint:disable-next-line:variable-name
    public weight_lbs: number;

    /**
     * #Item Name: Weight threshold exceeded flag
     * #British name: weight_alert
     * #Type: number
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public weight_alert: number;

    /**
     * #Item Name: Date before change
     * #British name: before_date
     * #Type: number
     */
    // tslint:disable-next-line:variable-name
    public before_date: number;

    /**
     * #Item Name: Date and time after change
     * #British name: after_date
     * #Type: number
     */
    // tslint:disable-next-line:variable-name
    public after_date: number;

    /**
     * #Item Name: Threshold setting: Threshold (kg)
     * #British name: threshold_kg
     * #Type: number
     */
    // tslint:disable-next-line:variable-name
    public threshold_kg: number;

    /**
     * #Item Name: Threshold setting: Threshold (lbs)
     * #British name: threshold_lbs
     * #Type: number
     */
    // tslint:disable-next-line:variable-name
    public threshold_lbs: number;

    /**
     * #Item Name: Threshold setting: period
     * #British name: threshold_period
     * #Type: number
     */
    // tslint:disable-next-line:variable-name
    public threshold_period: number;

    /**
     * #Item Name: Threshold systolic blood pressure
     * #British name: sys_threshold
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public sys_threshold: number;

    /**
     * #Item Name: Threshold diastolic blood pressure
     * #British name: dia_threshold
     * #Type: number
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public dia_threshold: number;

    /**
     * #Item Name: Rank
     * #British name: rank_total
     * #Type: number
     * #Use explanation:: 0:1 without rank: L and 2: M and 3: MH and 4: H . Graph tab badge display in case of "4:H"
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public rank_total: number;

    /**
     * #Item Name: Pod message
     * #British name: bot
     * #Type: number
     * #Use explanation:: 0: The Pod message is not displayed. 1-5: The done Pod message for is displayed.
     */
    @IsNotEmpty()
    public bot: number;

    /**
     * #Item Name: Patient list back flag
     * #British name: list_back
     * #Type: number
     * #Use explanation:Whether to display a button to return to the patient list on the patient details screen 0: Hide, 1: Show.
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public list_back: number;

    /**
     * #Item Name: HAID registration date
     * #British name: ha_regist_date
     * #Type: string
     * #Use explanation: Provide in the format of "YYYY-MM-DD",
     * It is used to determine the display of the “page back” button for switching the display period of the patient details
     * When returning to the date of return, the "Page Back" button is hidden.
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_regist_date: string;

    /**
     * #Item Name: First base date of examination month
     * #British name: base_date_month
     * #Type: number
     * #Use explanation: Specify in request parameter "Monthly consultation time start date" of "Consultation time acquisition API"
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public base_date_month: number;

    /**
     * #Item Name: Consultation time polling interval
     * #British name: medical_time_polling_interval
     * #Type: number
     * #Use explanation: Use as request interval for "Medical consultation time registration API". Unit is seconds
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public medical_time_polling_interval: number;

    /**
     * #Item Name: Default display tab
     * #British name: default_display_tab
     * #Type: number
     * #Use explanation: 1: Blood pressure tab (average daily). 2: Weight tab
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public default_display_tab: number;
}
