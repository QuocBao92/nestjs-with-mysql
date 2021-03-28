/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';
import { IsNotEmpty } from 'class-validator';

export class RequestRegister extends BaseModel {

    /**
     * #Item name: HeartAdvisorUserID
     * #Type: string.
     * #Use explanation: UserID of Heart Advisor is specified.
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item name: contract_weight_scale.
     * #Type: number.
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public contract_weight_scale: number;

    /**
     * #Item name: smartphone_use.
     * #Type: number.
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public smartphone_use: number;

    /**
     * #Item name: ha_regist_date.
     * #Type: string.
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_regist_date: string;
}
