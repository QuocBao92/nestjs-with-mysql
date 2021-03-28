/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseRequest } from './base-request.model';

export class RequestCommonDetailPatient extends BaseRequest {
    /**
     * ha_user_id
     */
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * list HAID from session
     */
    // tslint:disable-next-line:variable-name
    public haids: string[];
}
