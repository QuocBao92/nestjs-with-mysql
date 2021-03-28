/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../../models';
import { IsNotEmpty } from 'class-validator';

export class BloodPressureInformation extends BaseModel {

    /**
     * #Item Name: Measurement date and time.
     * #British name: date_time
     * #Type: string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public date_time: string;

    /**
     * #Item Name: Measurement type
     * #British name: input_type
     * #Type: number
     * #Use explanation:Type ID by which measurement situation is shown. 1:Automatic operation 2: Person input 3: Examination room input
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public input_type: number;

    /**
     * #Item Name: Systolic blood pressure.
     * #British name: sys
     * #Type: number
     */
    @IsNotEmpty()
    public sys: number;

    /**
     * #Item Name: Diastolic blood pressure.
     * #British name: dia
     * #Type: number
     */
    @IsNotEmpty()
    public dia: number;

    /**
     * #Item Name: Pulse
     * #British name: pulse
     * #Type: number
     */
    @IsNotEmpty()
    public pulse: number;

    /**
     * #Item Name: State of measurement
     * #British name: meas_state
     * #Type: Array[integer]
     * #Use explanation: The code corresponding to the state of the measurement is set by switching off the comma district.
     *  1:Arrhythmia having and 2: Body motion having and 3: State NG of [kafu] rolling.
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public meas_state: number[];
}
