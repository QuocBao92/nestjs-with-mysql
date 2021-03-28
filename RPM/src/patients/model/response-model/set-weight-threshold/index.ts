/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { Result, BaseModel } from '../../../../models';

export class SetWeightThreshold extends BaseModel {

    /**
     * #Item Name: Result
     * #British name: result
     * #Type: object
     */
    @IsNotEmpty()
    public result: Result;
}
