/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { BaseModel, Result } from '../../../../models';

export class MedicalTimeResponseModel extends BaseModel {

    /**
     * #Item Name: Result
     * #British name: result
     * #Type: object
     */
    @IsNotEmpty()
    public result: Result;

    /**
     * #Item Name: Monthly consultation time
     * #British name: Monthly consultation time
     * #Type: number
     */
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public monthly_medical_time: number;
}
