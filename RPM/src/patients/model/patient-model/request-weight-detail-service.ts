/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../models';

export class RequestWeightDetailService extends BaseModel {
    /**
     * ha_user_id
     */
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * date_from
     */
    // tslint:disable-next-line:variable-name
    public date_from: string;

    /**
     * date_to
     */
    // tslint:disable-next-line:variable-name
    public date_to: string;
}
