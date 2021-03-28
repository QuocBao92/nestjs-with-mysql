/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { RequestHeartAdvisorUserId } from '../../../ohi/models/request-model';

export class RequestPatientListService extends RequestHeartAdvisorUserId {

    /**
     * #Item name: Screen type
     * #British name: type
     * #Type: number
     * #Use explanation: 1:Patient list (blood pressure). 2:Patient list (weight)
     */
    // tslint:disable-next-line:variable-name
    public type: number;

    /**
     * ha_user_ids
     */
    // tslint:disable-next-line:variable-name
    public ha_user_ids: string[];

    /**
     * Page type from session data
     */
    // tslint:disable-next-line:variable-name
    public page_type: number;
}
