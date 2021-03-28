import BaseModel from 'src/model/base-model'
import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

interface NotifyType {
    BloodPressure: 1,
    Weight: 2
}

export class MessageInformation extends BaseModel {

    /**
     * Set alert type to notify REDOX
     * #Item name: Type
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public type: number

    /**
     * Set Message to notify REDOX
     * #Item name: Message
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public message: string

    /**
     * Set Send date when alert is notified. This date is calculated by RPM server
     * #Item name: Send date
     * #type: epoch timestamp
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public date: number

}