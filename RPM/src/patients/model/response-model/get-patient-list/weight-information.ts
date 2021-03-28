/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../../models';
import { Length } from 'class-validator';

export class WeightInformation extends BaseModel {

    /**
     * #Item Name: Last measurement date of weight data
     * #British name: last_update
     * #Type: string
     */
    @Length(10)
    // tslint:disable-next-line:variable-name
    public last_update: string;

    /**
     * #Item Name: Date before change
     * #British name: before_day
     * #Type: string.
     */
    @Length(10)
    // tslint:disable-next-line:variable-name
    public before_day: string;

    /**
     * #Item Name: Weight before change (lbs)
     * #British name: before_weight_lbs
     * #Type: number
     * #Use explanation: The unit is lbs.
     */
    // tslint:disable-next-line:variable-name
    public before_weight_lbs: number;

    /**
     * #Item Name: Weight before change (kg)
     * #British name: before_weight_kg
     * #Type: number
     */
    // tslint:disable-next-line:variable-name
    public before_weight_kg: number;

    /**
     * #Item Name: Date after change
     * #British name: after_day
     * #Type: string.
     */
    @Length(10)
    // tslint:disable-next-line:variable-name
    public after_day: string;

    /**
     * #Item Name: Weight after fluctuation (lbs)
     * #British name: after_weight_lbs
     * #Type: number
     * #Use explanation: The unit is lbs.
     */
    // tslint:disable-next-line:variable-name
    public after_weight_lbs: number;

    /**
     * #Item Name: Weight after change (kg)
     * #British name: after_weight_kg
     * #Type: number
     */
    // tslint:disable-next-line:variable-name
    public after_weight_kg: number;

    /**
     * #Item Name: Threshold setting: Threshold (kg)
     * #British name: threshold_kg
     * #Type: number
     * #Use explanation: Threshold value for threshold setting when a weight threshold exceeded alert (kg)
     */
    // tslint:disable-next-line:variable-name
    public threshold_kg: number;

    /**
     * #Item Name: Threshold setting: Threshold (lbs)
     * #British name: threshold_lbs
     * #Type: number
     * #Use explanation: Threshold value for threshold setting when a weight threshold exceeded alert (lbs)
     */
    // tslint:disable-next-line:variable-name
    public threshold_lbs: number;

    /**
     * #Item Name: Change of weight: Period: Numerical value
     * #British name: threshold_period
     * #Type: number
     * #Use explanation: Day: 1-30
     */
    // tslint:disable-next-line:variable-name
    public threshold_period: number;
}
