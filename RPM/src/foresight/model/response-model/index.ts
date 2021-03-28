/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import { BaseModel, Result } from '../../../models';
import { MedicalTimeInfo } from './medical_time_info-model';
import { IsNotEmpty } from 'class-validator';

export class MedicalTimeResponseModel extends BaseModel {
    /**
     * #Item Name: Result
     * #British name: result
     * #Type: object
     */
    @IsNotEmpty()
    public result: Result;

    /**
     * #Item Name: Consultation time information
     * #British name: Consultation time information
     * #Type: object
     */
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public medical_time_info: MedicalTimeInfo[];
}
