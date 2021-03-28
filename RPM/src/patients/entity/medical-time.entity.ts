/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import { IsNotEmpty } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'd_medical_time' })
@Index('Index_haUserId', ['ha_user_id', 'start_date'], { unique: false })
export class MedicalTime {

    /**
     * #British Name: Access token
     * #Use Explanation: Access token used when patient detailed screen is displayed
     * #Type: varchar
     * #Indispensability: true
     */
    @Column({ name: 'access_token', type: 'varchar', length: 255, nullable: false, primary: true })
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public access_token: string;

    /**
     * #British Name: HeartAdvisorUserID
     * #Use Explanation: Patient identification key when data is referred from OHI
     * #Type: char
     * #Indispensability: true
     */
    @Column({ name: 'ha_user_id', type: 'char', length: 64, nullable: false, primary: true })
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public ha_user_id: string;

    /**
     * #British Name: Start of counting date
     * #Use Explanation: Date when display of patient detailed screen is begun Unix timestamp (millisecond)
     * #Type: bigint
     * #Indispensability: true
     */
    @Column({ name: 'start_timestamp', type: 'bigint', nullable: false, primary: true })
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public start_timestamp: number;

    /**
     * #British Name: Examination start date
     * #Use Explanation: The date when it tempered with "Time zone" notified by API for the doctor dashboard is
     * registered based on "Start of counting date". It uses it as an index when the record is retrieved.
     * #Type: date
     * #Indispensability: true
     */
    @Column({ name: 'start_date', type: 'date', nullable: false })
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public start_date: Date;

    /**
     * #British Name: Examination time
     * #Use Explanation: Time to have displayed patient detailed screen (second).
     * Not examination time of total but one examination time (time from display of patient detailed screen to end of the display)
     * #Type: number
     * #Indispensability: true
     */
    @Column({ name: 'medical_time', type: 'int', nullable: false })
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public medical_time: number;

    /**
     * #British Name: At the record registration date
     * #Use Explanation: Record registration date and time.
     * #Type: timestamp
     * #Indispensability: true
     */
    @Column({ name: 'regist_date', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public regist_date: string;

    /**
     * #British Name: Record updated day and hour
     * #Use Explanation: ON UPDATE CURRENT_TIMESTAMP()
     * #Type: timestamp
     * #Indispensability: true
     */
    @Column({ name: 'update_date', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public update_date: string;
}
