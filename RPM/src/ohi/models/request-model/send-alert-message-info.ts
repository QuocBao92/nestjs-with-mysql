/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../models';

export enum NotifyType {
    BloodPressure = 1,
    Weight = 2,
}

export class MessageInformation extends BaseModel {

    /**
     * Set alert type to notify REDOX
     * #Item name: Type
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public type: NotifyType;

    /**
     * Set Message to notify REDOX
     * #Item name: Message
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public message: string;

    /**
     * Set Send date when alert is notified. This date is calculated by RPM server
     * #Item name: Send date
     * #type: epoch timestamp
     */
    @ApiModelProperty()
    @IsNotEmpty()
    public date: number;

}
