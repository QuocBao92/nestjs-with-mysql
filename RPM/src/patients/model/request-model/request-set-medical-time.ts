/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../models';
import { ApiModelProperty } from '@nestjs/swagger';

export class RequestSetMedicalTime extends BaseModel {
    /**
     * #Item Name: Start of counting date
     * #British Name: start_timestamp
     * #Type: integer
     */
    @ApiModelProperty()
    // tslint:disable-next-line: variable-name
    public start_timestamp: number;

    /**
     * #Item Name: Time zone
     * #British Name: timezone
     * #Type: string
     */
    @ApiModelProperty()
    public timezone: string;

    /**
     * #Item Name: Examination time
     * #British Name: medical_time
     * #Type: integer
     */
    @ApiModelProperty()
    // tslint:disable-next-line: variable-name
    public medical_time: number;
}
