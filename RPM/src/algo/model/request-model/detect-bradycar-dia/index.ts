/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../../models';
import { RequestDetectBradycarDiaDataModel } from './detect-bradicar-model';

export class RequestDetectBradycarDia extends BaseModel {
    /**
     * #Item name: Vital data
     * #British Name: data
     * #Type: Object
     * #Use explanation: Average data for each vital.
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public data: RequestDetectBradycarDiaDataModel;

    /**
     * #Item name: Note
     * #British Name: memo
     * #Type: string
     * #Use explanation: Traces processing on the server from client requests..
     */
    @ApiModelProperty({ required: false })
    public memo: string;
}
