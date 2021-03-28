/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import {
    IsNotEmpty,
    Max,
    Min,
} from 'class-validator';

import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';

export class RequestBodySetPersonalBPInfo extends BaseModel {
    /**
     * #Item name: HeartAdvisorUserID
     * #Use explanation: UserID of Heart Advisor is specified.
     */
    @ApiModelProperty()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    /**
     * #Item name: Acquisition beginning date
     * #Type: integer
     * #Development explanation: A specified value is invalid for method "DELETE".
     * #Use explanation: The maximal pressure of the target is specified.
     */
    @ApiModelProperty()
    @Min(41)
    @Max(279)
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public goal_sys: number;

    /**
     * #Item name: Acquisition end date
     * #Type: integer
     * #Development explanation: A specified value is invalid for method "DELETE".
     * #Use explanation: The minimal pressure of the target is specified.
     */
    @ApiModelProperty()
    @Min(41)
    @Max(254)
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public goal_dia: number;

    /**
     * #Item name: Acquisition beginning date
     * #Type: integer
     * #Development explanation: A specified value is invalid for method "DELETE".
     * #Use explanation: The maximal pressure of the target is specified.
     */
    @ApiModelProperty()
    @Min(41)
    @Max(279)
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public threshold_sys: number;

    /**
     * #Item name: Acquisition end date
     * #Type: integer
     * #Development explanation: A specified value is invalid for method "DELETE".
     * #Use explanation: The minimal pressure of the target is specified.
     */
    @ApiModelProperty()
    @Min(41)
    @Max(254)
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public threshold_dia: number;
}
