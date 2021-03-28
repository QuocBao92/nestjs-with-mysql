/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel } from '../../../models';
import { ApiModelProperty } from '@nestjs/swagger';

export class RequestGetMedicalTime extends BaseModel {

    /**
     * #Item name: Monthly consultation time starting date
     * #British name: monthly_start_date
     * #Type: string
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public monthly_start_date: string;

    /**
     * #Item name: Monthly consultation time closing day
     * #British name: monthly_end_date
     * #Type: string
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public monthly_end_date: string;
}
