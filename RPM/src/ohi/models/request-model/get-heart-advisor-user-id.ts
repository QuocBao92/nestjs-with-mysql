/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';

export class RequestHeartAdvisorUserId extends BaseModel {

    /**
     * #Item Name: Hospital ID.
     * #Parameter Name: ehr_id.
     * #Type: string.
     * #Usage: Set Hospital ID received from Redox.
     */
    @ApiModelProperty({ required: false })
    // tslint:disable-next-line:variable-name
    public ehr_id: string;

    /**
     * #Item Name: Doctor ID.
     * #Parameter Name: npi_id.
     * #Type: string.
     * #Usage: Set Doctor ID received from Redox
     */
    @ApiModelProperty({ required: false })
    // tslint:disable-next-line:variable-name
    public npi_id: string;

    /**
     * #Item Name: Patient ID
     * #Parameter Name: mr_id.
     * #Type: string.
     * #Usage: Set Patient ID received from Redox.
     */
    @ApiModelProperty({ required: false })
    // tslint:disable-next-line:variable-name
    public mr_id: string;
}
