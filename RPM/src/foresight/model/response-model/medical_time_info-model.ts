/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import { IsNotEmpty } from 'class-validator';

export class MedicalTimeInfo {

    /**
     * #Item Name: HeartAdvisorUserID
     * #British name: HeartAdvisorUserID
     * #Type: String
     */
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public ha_user_id: string;

    /**
     * #Item Name: Consultation time
     * #British name: Consultation time
     * #Type: number
     */
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public medical_time: number;
}
