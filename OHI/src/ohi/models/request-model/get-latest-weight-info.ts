import { IsNotEmpty } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger'
import BaseModel from 'src/model/base-model'

export class RequestLatestWeightInfo extends BaseModel{
    /**
     * #Item name: Automatic operation/person input flag
     * #Type: integer
     * #Use explanation: The vital input method is specified. 1:Automatic operation and 2: Person input and 3: Both automatic operation/manual
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public input_type: number

    /**
     * #Item name: HeartAdvisorUserID
     * #Type: array
     * #Use explanation: UserID of Heart Advisor is specified. 
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string[]
}