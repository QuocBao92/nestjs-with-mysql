/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../../models';
import { IsNotEmpty } from 'class-validator';

export class BloodpressureInfor extends BaseModel {

    /**
     * #Item Name: HeartAdvisorUserID
     * #British Name: ha_user_id
     * #Use Explanation: Patient ID is set.
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item Name: Target: Maximal pressure
     * #British Name: goal_sys
     * #Use Explanation: The setting of the target of the maximal pressure value is set.
     * #Type: number
     * #Indispensability: true
     */
    // tslint:disable-next-line:variable-name
    public goal_sys: number;

    /**
     * #Item Name: Target: Minimal pressure
     * #British Name: goal_dia
     * #Use Explanation: The setting of the target of the minimal pressure value is set.
     * #Type: number
     * #Indispensability: true
     */
    // tslint:disable-next-line:variable-name
    public goal_dia: number;
    /**
     * #Item Name: Threshold: Maximal pressure
     * #British Name: goal_sys
     * #Use Explanation: The setting of the target of the maximal pressure value is set.
     * #Type: number
     * #Indispensability: true
     */
    // tslint:disable-next-line:variable-name
    public sys_threshold: number;

    /**
     * #Item Name: Threshold: Minimal pressure
     * #British Name: goal_dia
     * #Use Explanation: The setting of the target of the minimal pressure value is set.
     * #Type: number
     * #Indispensability: true
     */
    // tslint:disable-next-line:variable-name
    public dia_threshold: number;

    /**
     * #Item Name: Updated day and hour
     * #Use Explanation: Updated day and hour are set.
     * #Type: string - epoch timestamp
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public updated_at: number;

    /**
     * #Item Name: Date and time of creation
     * #Use Explanation: The date and time of creation is set.
     * #Type: string - epoch timestamp
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public created_at: number;

}
