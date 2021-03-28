/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty, Length } from 'class-validator';
import { BaseModel } from '../../../../models';

export class PatientInformationWeight extends BaseModel {

    /**
     * #Item Name: Measurement date and time
     * #British name: date_time
     * #Type: String
     */
    @IsNotEmpty()
    @Length(25)
    // tslint:disable-next-line:variable-name
    public date_time: string;

    /**
     * #Item Name: Measurement type
     * #British name: input_type
     * #Type: number
     * #Use explanation: Type ID by which measurement situation is shown. 1:Automatic operation. 2: Person input
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public input_type: number;

    /**
     * #Item Name: Weight (kg)
     * #British name: weight_kg
     * #Type: number
     * #Use explanation: The unit is kg.
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public weight_kg: number;

    /**
     * #Item Name: Weight (lbs)
     * #British name: weight_lbs
     * #Type: number
     * #Use explanation: The unit is lbs.
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public weight_lbs: number;

    /**
     * #Item Name: BMI
     * #British name: bmi
     * #Type: number
     */
    public bmi: number;
}
