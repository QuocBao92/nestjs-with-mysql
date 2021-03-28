import { ApiModelProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    Max,
    Min,
} from 'class-validator';

export class RequestBodySetPersonalBPInfo {
    /**
     * #Item name: HeartAdvisorUserID
     * #Use explanation: UserID of Heart Advisor is specified. 
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string

    /**
     * #Item name: Acquisition beginning date
     * #Type: integer
     * #Development explanation: A specified value is invalid for method "DELETE".
     * #Use explanation: The maximal pressure of the target is specified.
     */
    @ApiModelProperty()
    @Min(20)
    @Max(280)
    // tslint:disable-next-line:variable-name
    public goal_sys: number;

    /**
     * #Item name: Acquisition end date
     * #Type: integer
     * #Development explanation: A specified value is invalid for method "DELETE".
     * #Use explanation: The minimal pressure of the target is specified.
     */
    @ApiModelProperty()
    @Min(20)
    @Max(280)
    // tslint:disable-next-line:variable-name
    public goal_dia: number;

    /**
     * #Item name: Acquisition beginning date
     * #Type: integer
     * #Development explanation: A specified value is invalid for method "DELETE".
     * #Use explanation: The maximal pressure of the target is specified.
     */
    @ApiModelProperty()
    @Min(20)
    @Max(280)
    // tslint:disable-next-line:variable-name
    public threshold_sys: number;

    /**
     * #Item name: Acquisition end date
     * #Type: integer
     * #Development explanation: A specified value is invalid for method "DELETE".
     * #Use explanation: The minimal pressure of the target is specified.
     */
    @ApiModelProperty()
    @Min(20)
    @Max(280)
    // tslint:disable-next-line:variable-name
    public threshold_dia: number;
}