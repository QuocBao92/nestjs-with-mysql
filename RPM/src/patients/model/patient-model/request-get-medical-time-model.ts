/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../models';

export class RequestGetMedicalTimeService extends BaseModel {

    /**
     * ha_user_id
     */
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item name: Monthly consultation time starting date
     * #British name: monthly_start_date
     * #Type: string
     */
    // tslint:disable-next-line:variable-name
    public monthly_start_date: string;

    /**
     * #Item name: Monthly consultation time closing day
     * #British name: monthly_end_date
     * #Type: string
     */
    // tslint:disable-next-line:variable-name
    public monthly_end_date: string;
}
