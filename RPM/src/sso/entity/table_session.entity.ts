/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'd_session' })
export class TableSession {

    /**
     * - SessionID
     * - ID used for log in of doctor dashboard screen
     */
    @Column({ name: 'session_id', type: 'varchar', length: 255, nullable: false, primary: true })
    // tslint:disable-next-line:variable-name
    public session_id: string;

    /**
     * - Log in information.
     * - It is information in SessionID such as hospitals ID.  for the stringJson form
     */
    @Column({ name: 'login_data', type: 'mediumtext', nullable: false })
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public login_data: string;

    /**
     * - Access token
     * - Token information given to HTTP header when doctor dashboard API is called
     */
    @Column({ name: 'access_token', type: 'varchar', length: 255, nullable: true, default: null })
    @Index('Index_accesstoken', {unique: true})
    // tslint:disable-next-line:variable-name
    public access_token: string;

    /**
     * expire
     */
    @Column({ name: 'exp_date', type: 'bigint', nullable: false })
    @Index('Index_expdate', {unique: false})
    // tslint:disable-next-line:variable-name
    public exp_date: number;

    /**
     * regist_date
     */
    @Column({ name: 'regist_date', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    // tslint:disable-next-line:variable-name
    public regist_date: string;

    /**
     * - Record updated day and hour
     * - ON UPDATE CURRENT_TIMESTAMP()
     */
    @Column({ name: 'update_date', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    // tslint:disable-next-line:variable-name
    public update_date: string;
}
