import { ApiModelProperty } from '@nestjs/swagger';
import BaseModel from 'src/model/base-model';
import { IsNotEmpty } from 'class-validator';

export class RequestGetPersonalInfo extends BaseModel{

    /**
     * HeartAdvisorUserID
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string[];
  
}