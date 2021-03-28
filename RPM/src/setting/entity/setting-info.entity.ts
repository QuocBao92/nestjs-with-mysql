/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Column, Entity } from 'typeorm';

@Entity({ name: 'm_setting_info' })
export class SettingInfo {

    /**
     * #British Name: setting_key
     * #Use Explanation: Set key.
     * #Type: string
     * #Indispensability: true
     */
    @Column({ name: 'setting_key', type: 'varchar', length: 50, nullable: false, primary: true })
    // tslint:disable-next-line:variable-name
    public setting_key: string;

    /**
     * #British Name: setting_value
     * #Use Explanation: Set value.
     * #Type: string
     * #Indispensability: true
     */
    @Column({ name: 'setting_value', type: 'varchar', length: 255, nullable: false })
    // tslint:disable-next-line:variable-name
    public setting_value: string;

    /**
     * #British Name: regist_date
     * #Use Explanation: At the record registration date.
     * #Type: string
     * #Indispensability: true
     */

    @Column({ name: 'regist_date', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    // tslint:disable-next-line:variable-name
    public regist_date: string;

    /**
     * #British Name: update_date
     * #Use Explanation: Record updated day and hour.
     * #Type: string
     * #Indispensability: true
     */

    @Column({ name: 'update_date', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    // tslint:disable-next-line:variable-name
    public update_date: string;
}
