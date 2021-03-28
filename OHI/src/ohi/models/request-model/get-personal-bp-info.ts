import { ApiModelProperty } from '@nestjs/swagger';
import BaseModel from '../../../model/base-model';
import { IsNotEmpty } from 'class-validator';

export class RequestBodyGetPersonalBPInfo extends BaseModel {

    /**
     * HeartAdvisorUserID
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string[];
}