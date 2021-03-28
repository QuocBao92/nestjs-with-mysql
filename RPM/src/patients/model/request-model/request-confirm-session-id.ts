/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';

export class RequestConfirmSessionId {
    /**
     * #Item Name: SessionID
     * #British Name: sessionId
     * #Type: string
     * #Description: Session ID that identifies the login status
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public sessionId: string;
}
