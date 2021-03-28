/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../models';

export class RequestBloodPressureDetailService extends BaseModel {
    /**
     * ha_user_id
     */
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item name: Acquisition start date of period
     * #British name: date_from
     * #Type: string
     * #Use explanation: When page sending button is pressed, and it changes from other detailed screens, it uses it.
     */
    // tslint:disable-next-line:variable-name
    public date_from: string;

    /**
     * #Item name: Acquisition end date of period
     * #British name: date_to
     * #Type: string
     * #Use explanation: When page sending button is pressed, and it changes from other detailed screens, it uses it.
     */
    // tslint:disable-next-line:variable-name
    public date_to: string;
}
