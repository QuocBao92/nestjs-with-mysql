/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MessageInformation } from './send-alert-message-info';
import BaseModel from '../../../model/base-model';

export class RequestBodySendBPAlert extends BaseModel {

    /**
     * #Name: Heart Advisor UserID
     * Set HeartAdvisorUserID of a patient to notify REDOX
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Name: Threshold: systolic blood pressure
     * #Type: sys_threshold
     * SYS Threshold during ranking processing
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_threshold: number;

    /**
     * #Name: Threshold: diastolic  blood pressure
     * #Type: dia_threshold
     * DIA Threshold during ranking processing
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_threshold: number;

    /**
     * #Name: Average: systolic blood pressure
     * #Type: sys_average
     * SYS Threshold during ranking processing
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_average: number;

    /**
     * #Name: Average: diastolic blood pressure
     * #Type: dia_average
     * SYS Threshold during ranking processing
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_average: number;

    /**
     * Set Send date when alert is notified. This date is calculated by RPM server
     * #Item name: Send date
     * #type: epoch timestamp
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public date: number;

    // /**
    //  * Data
    //  * Array of message information
    //  */
    // @ApiModelProperty()
    // @IsNotEmpty()
    // public data: MessageInformation[];
}
