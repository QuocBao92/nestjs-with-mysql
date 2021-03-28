/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';

export class RequestUpdateHaid {
    /**
     * #Item Name: HeartAdvisorUserID
     * #British Name: ha_user_id
     * #Type: string
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;
}
