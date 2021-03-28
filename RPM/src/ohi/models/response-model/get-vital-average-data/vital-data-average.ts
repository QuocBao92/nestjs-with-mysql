/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../../models';

export class VitalDataAverage extends BaseModel {

    /**
     * #Name: Measurement Date
     * #Usage: Set Measurement Date
     */
    @IsNotEmpty()
    public date: Date;

    /**
     * #Name: Systolic Morning Average blood pressure
     * #Usage: Set Measurement Date
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_avg_morning: string;

    /**
     * #Name: Systolic Evening Average blood pressure
     * #Usage: Set Measurement Date
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_avg_evening: string;

    /**
     * #Name: Systolic Evening Average blood pressure
     * #Usage: Set Measurement Date
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_avg_day: string;

    /**
     * #Name: Systolic Average Office blood pressure
     * #Parameter Name: sys_avg_office
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_avg_office: string;

    /**
     * #Name: Diastolic Morning Average blood pressure
     * #Parameter Name: dia_avg_morning
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_avg_morning: string;

    /**
     * #Name: Diastolic Evening Average blood pressure
     * #Parameter Name: dia_avg_evening
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_avg_evening: string;

    /**
     * #Name: Diastolic Daily Average blood pressure
     * #Parameter Name: dia_avg_day
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_avg_day: string;

    /**
     * #Name: Diastolic Office Average blood pressure
     * #Parameter Name: dia_avg_office
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_avg_office: string;

    /**
     * #Name:  Morning Average Pulse
     * #Parameter Name: pulse_avg_morning
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public pulse_avg_morning: string;

    /**
     * #Name: Evening Average Pulse
     * #Parameter Name: pulse_avg_evening
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public pulse_avg_evening: string;

    /**
     * #Name: Daily Average pulse
     * #Parameter Name: pulse_avg_day
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public pulse_avg_day: string;

    /**
     * #Name: Office Average pulse
     * #Parameter Name: pulse_avg_day
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public pulse_avg_office: string;

    /**
     * #Item Name: Updated day and hour
     * #Use Explanation: Updated day and hour are set.
     * #Type: string - epoch timestamp.
     * #Indispensability: true.
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public updated_at: number;

    /**
     * #Item Name: Date and time of creation
     * #Use Explanation: The date and time of creation is set.
     * #Type: string - epoch timestamp
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public created_at: number;
}
