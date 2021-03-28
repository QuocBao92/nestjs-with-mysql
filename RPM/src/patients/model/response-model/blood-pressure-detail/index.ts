/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel, Result } from '../../../../models';
import { IsNotEmpty, Length } from 'class-validator';
import { AverageInformation } from './average-infromation';
import { BloodPressureInformation } from './blood-information';
import { GraphInformation } from './graph-information';
import { MedicationInformation } from './medication-information';

export class BloodPressureDetail extends BaseModel {

    /**
     * #Item Name: Result
     * #British name: result
     * #Type: object
     */
    @IsNotEmpty()
    public result: Result;

    /**
     * #Item Name: Smartphone application presence
     * #British name: contract_application
     * #Type: number
     * #Use explanation: It uses it for the side effect label display and non-display of the graph screen. 0:It is not. 1:It is.
     */
    @IsNotEmpty()
    @Length(10)
    // tslint:disable-next-line:variable-name
    public contract_application: number;

    /**
     * #Item Name: Blood pressure detailed information array
     * #British name: row_data
     * #Type: Array[object]
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public row_data: BloodPressureInformation[];

    /**
     * #Item Name: Average information array every blood pressure day
     * #British name: daily_data
     * #Type: Array[object]
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public daily_data: AverageInformation[];

    /**
     * #Item Name: Graph information array
     * #British name: graph_data
     * #Type: Array[object]
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public graph_data: GraphInformation[];

    /**
     * #Item Name: Medication information array
     * #British name: medicine_data
     * #Type: Array[object]
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public medicine_data: MedicationInformation[];
}
