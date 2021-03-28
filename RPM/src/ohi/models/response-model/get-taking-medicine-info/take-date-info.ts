/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../../models';

export class TakeDateInfo extends BaseModel {

    /**
     * #Item Name: Day of taking medicine
     * #Use Explanation: The day of taking medicine is set.
     * #Type: date(Localtime)(ISO8601 format)
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public take_date: Date;

    /**
     * #Item Name: Medication rate on medication day.
     * #Use Explanation: Set the medication rate for medication days.
     * #Type: number
     * #Indispensability: false
     */
    // tslint:disable-next-line:variable-name
    public take_rate: number;

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
