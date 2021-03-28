/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { RequestSetPersonalBloodPressure } from '../request-model/request-set-personal-blood-pressure';

export class SetPersonalBloodPressureModel extends RequestSetPersonalBloodPressure {
    /**
     * ha_user_id
     */
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;
}
