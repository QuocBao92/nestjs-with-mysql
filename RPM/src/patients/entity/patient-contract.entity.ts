/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';

/**
 * d_patient_contract
 */
@Entity({ name: 'd_patient_contract' })
export class PatientContract {

    /**
     * #British Name: ha_user_id
     * #Use Explanation: HeartAdvisorUserID.
     * #Type: string
     * #Indispensability: true
     */
    @Column({ name: 'ha_user_id', type: 'char', length: 64, nullable: false, primary: true })
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #British Name: contract_weight
     * #Use Explanation: Weight body composition meter contract existence.
     * #Type: string
     * #Indispensability: true
     */
    @Column({ name: 'contract_weight', type: 'tinyint', nullable: false, default: 0 })
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public contract_weight: number;

    /**
     * #British Name: contract_application
     * #Use Explanation: [Sumahoapuri] existence.
     * #Type: number
     * #Indispensability: true
     */
    @Column({ name: 'contract_application', type: 'tinyint', nullable: false, default: 0 })
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public contract_application: number;

    /**
     * #British Name: delete_flag
     * #Use Explanation: Secession flag.
     * #Type: number
     * #Indispensability: true
     */
    @Column({ name: 'delete_flag', type: 'tinyint', nullable: false, default: 0 })
    @Index('Index_deleteflag')
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public delete_flag: number;

    /**
     * #British Name: ha_regist_date
     * #Use Explanation: HAID registration date
     * #Type: number
     * #Indispensability: true
     */
    @Column({ name: 'ha_regist_date', type: 'date', nullable: false })
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_regist_date: Date;

    /**
     * #British Name: regist_date
     * #Use Explanation: Record registration date and time.
     * #Type: string
     * #Indispensability: true
     */
    @Column({ name: 'regist_date', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public regist_date: string;

    /**
     * Record updated day and hour
     */
    @Column({ name: 'update_date', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public update_date: string;
}
