import BaseModel from '../../../model/base-model'
import { IsNotEmpty } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger';

export class RequestHeartAdvisorUserId extends BaseModel {

    /**
     * Hospital ID
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public ehr_id: string
 
    /**
     * Doctor ID
     */
    @ApiModelProperty({ required: false })
    // tslint:disable-next-line:variable-name
    public npi_id: string
    
    /**
     * Patient ID
     */
    @ApiModelProperty({ required: false })
    // tslint:disable-next-line:variable-name
    public mr_id: string
}