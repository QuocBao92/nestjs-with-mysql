/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../../models';

export class Result extends BaseModel {
    /**
     * #Item name: Systolic blood pressure
     * #British Name: sys.
     * #Type: number.
     * #Use explanation: systolic blood pressure value on the date specified by date
     */
    public sys: number;

    /**
     * #Item name: diastolic blood pressure
     * #British Name: dia.
     * #Type: number.
     * #Use explanation: diastolic blood pressure value on the date specified by date
     */
    public dia: number;

}
