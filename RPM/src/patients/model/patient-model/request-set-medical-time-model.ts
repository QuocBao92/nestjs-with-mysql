/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { RequestSetMedicalTime } from '../request-model/request-set-medical-time';

export class SetMedicalTimeModel extends RequestSetMedicalTime {
    /**
     * #Item Name: HeartAdvisorUserID
     * #British Name: ha_user_id
     * #Type: string
     */
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;
}
