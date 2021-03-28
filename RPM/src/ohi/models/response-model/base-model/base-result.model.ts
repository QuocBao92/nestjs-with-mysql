/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty, Length } from 'class-validator';
import { BaseModel } from '../../../../models';

export class Result extends BaseModel {
    /**
     * #Item Name: Error code
     * #Use explanation:  Normally: 0. At the error: Please set it on the OHI server side.
     * #Indispensability: true
     * #Number of characters: 0-999
     */
    @Length(0, 999)
    @IsNotEmpty()
    public code: number;

    /**
     * #Item Name: Error message
     * #Use explanation: Normally: The item none. In case of normally: Please set it on the OHI server side.
     * #Number of characters: Irregularity
     */
    public message: string;
}
