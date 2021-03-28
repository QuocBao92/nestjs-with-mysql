/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseRequest } from './base-request';
import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RequestGetVitalData extends BaseRequest {

    /**
     * #Item Name: Data type
     * #Parameter Name: type
     * #Type: number
     * #Usage: Set Data type. 1: Blood pressure, 2: Weight
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public type: number;

    /**
     * #Item Name:Input type
     * #Parameter Name: input_type
     * #Type: number
     * #Usage: Set Input type. 1: Automatic, 2:Manual input, 3:Automatic & Manual input,
     * 4:Office, 5:Automatic & Office, 6:Manual input & Office, 7: all
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public input_type: number;

    /**
     * #Item Name: Acquisition data date type
     * #British Name: date_type
     * #Use Explanation: 1: Measurement date and time, 2: Update date and time.
     * #Type:  number
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public date_type: number;
}
