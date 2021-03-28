import { ApiModelProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    Max,
    Min,
} from 'class-validator';
import { SetWeightThresholdModel } from './weight-threshold-model';

export class RequestSetWeightThreshold {
    /**
     * #Item name: HeartAdvisorUserID
     * #Use explanation: UserID of Heart Advisor is specified. 
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item name: HeartAdvisorUserID
     * #Use explanation: UserID of Heart Advisor is specified. 
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public threshold: SetWeightThresholdModel;
}