import { ApiModelProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    Max,
    Min,
} from 'class-validator';

export class SetWeightThresholdModel  {
    /**
     * #Item name: id
     * #Use explanation: Threshold ID
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public id: number

    /**
     * #Item name: enabled_flag
     * #Use explanation: Valid Flag
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public enabled_flag: number;

    /**
     * #Item name: value
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public value: string;

    /**
     * #Item name: unit
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public unit: number;

    /**
     * #Item name: unit
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public period: number;
}