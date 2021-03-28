import { ApiModelProperty } from '@nestjs/swagger';
import BaseModel from 'src/model/base-model';
import { BaseRequest } from './base-request';

export class RequestVitalAverageData extends BaseRequest  {

    /**
     * #Name: Acquisition quantity
     * #Parameter Name: count
     */
    @ApiModelProperty()
    public count: number;
}