/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty, Length } from 'class-validator';
import { BaseModel } from '../../../../models';

export class AverageInformation extends BaseModel {

    /**
     * #Item Name: Measurement day
     * #British name: date
     * #Type: string
     * #Use explanation:: 1:"kg" 2:"lbs"
     */
    @IsNotEmpty()
    @Length(10)
    public date: string;

    /**
     * #Item Name: Rank
     * #British name: rank
     * #Type: number
     * #Use explanation:: 0:1 without rank: L and 2: M and 3: MH and 4: H. Item omission of day without rank judgment
     */
    @IsNotEmpty()
    @Length(10)
    // tslint:disable-next-line:variable-name
    public rank_total: number;

    /**
     * #Item Name: Systolic blood pressure daily average
     * #British name: sys_avg_day
     * #Type: number
     * #Use explanation:: Mean value of maximal pressure on measurement day
     */
    @Length(999)
    // tslint:disable-next-line: variable-name
    public sys_avg_day: number;

    /**
     * #Item Name: Diastolic blood pressure average
     * #British name: dia_avg_day
     * #Type: number
     * #Use explanation: Mean value of minimal pressure on measurement day
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public dia_avg_day: number;

    /**
     * #Item Name: Average on pulse day
     * #British name: avg_pulse
     * #Type: number
     * #Use explanation:: Mean value of pulse on measurement day
     */
    @Length(999)
    // tslint:disable-next-line:variable-name
    public avg_pulse: number;

    /**
     * #Item Name: Daily measurement status.
     * #British name: meas_state_day
     * #Type: array[int]
     * #Use explanation: The code corresponding to the state of the measurement is set by switching off the comma district.
     * 1:Arrhythmia having and 2: Body motion having and 3: State NG of [kafu] rolling
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public meas_state_day: number[];

    /**
     * #Item Name: Side effect
     * #British name: side_effects
     * #Type: array[int]
     * #Use explanation: The code corresponding to the side effect is set by switching off the comma district.
     * 1:The palpitation and 2: dizziness and 3: headache and 4: It burns, and 5: It swells, and 6: The cough.
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public side_effects: number[];
}
