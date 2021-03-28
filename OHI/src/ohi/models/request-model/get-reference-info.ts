import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';


export class RequestGetReferenceInfo {
    /**
     * HeartAdvisorUserID
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;
}