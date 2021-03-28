/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../models';
import { IsNotEmpty, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RequestGetMedicalTimeOHI extends BaseModel {

    /**
     * #Item name: HeartAdvisorUserID
     * #Type: Array[string]
     * #Use explanation: UserID of Heart Advisor is specified.
     */
    @IsNotEmpty()
    @ApiModelProperty()
    // tslint:disable-next-line: variable-name
    public ha_user_id: string[];

    /**
     * #Item name: Acquisition start date
     * #Type: String.
     * #Use explanation: Specify the start date of the period for which you want to obtain consultation time.
     */
    @IsNotEmpty()
    @Length(10)
    @ApiModelProperty()
    // tslint:disable-next-line: variable-name
    public start_date: string;

    /**
     * #Item name: Acquisition end date
     * #Type: String.
     * #Use explanation: Specify the end date of the period for which you want to obtain consultation time.
     */
    @IsNotEmpty()
    @Length(10)
    @ApiModelProperty()
    // tslint:disable-next-line: variable-name
    public end_date: string;
}
