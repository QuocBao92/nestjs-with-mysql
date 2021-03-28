/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../../models';

export class SysObject extends BaseModel {

    /**
     * #Item name: Morning judgment result
     * #British Name: am.
     * #Type: number
     * #Use explanation: Judgment result of Morning average of systolic blood pressure.
     */
    public am: number;

    /**
     * #Item name: Everning judgment result
     * #British Name: pm.
     * #Type: number
     * #Use explanation: Judgment result of Everning average of systolic blood pressure.
     */
    public pm: number;

    /**
     * #Item name: Daily judgment result
     * #British Name: daily.
     * #Type: number
     * #Use explanation:Judgment result of daily average of systolic blood pressure.
     */
    public daily: number;

}
