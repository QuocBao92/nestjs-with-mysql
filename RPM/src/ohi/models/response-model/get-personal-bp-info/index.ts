/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BloodpressureInfor } from './blood-pressure-info';
import { BaseDataItemModel } from '../base-model';
import { Result } from '../base-model/base-result.model';
import { IsNotEmpty } from 'class-validator';

export class GetPersonalBPInfoModel extends BaseDataItemModel {

    /**
     * #Item Name: Result
     * #British Name: result
     * #Type: object
     * #Indispensability: true
     */
    @IsNotEmpty()
    public result: Result;

    /**
     * #Name: Blood pressure information
     * #Parameter Name: bp_info
     */
    // tslint:disable-next-line:variable-name
    public bp_info: BloodpressureInfor[];
}
