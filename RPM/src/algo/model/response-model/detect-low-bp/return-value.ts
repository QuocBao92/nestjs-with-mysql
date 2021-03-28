/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import {  BaseModel } from '../../../../models';
import { Result } from './result';

export class ReturnValueObject extends BaseModel {
    /**
     * #Item Name: judgment result
     * #British Name: result.
     * #Type: number;
     */
    public result: Result;
}
