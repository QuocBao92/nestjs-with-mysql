/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../models';

export class RequestBatchData extends BaseModel {

    /**
     * patient
     */
    public patient: any;
    /**
     * #Item name: start day of batch
     * #British name: start_day
     * #Type: string
     */
    // tslint:disable-next-line:variable-name
    public start_day: string;
    /**
     * #Item name: end day of batch
     * #British name: end_day
     * #Type: string
     */
    // tslint:disable-next-line:variable-name
    public end_day: string;

}
