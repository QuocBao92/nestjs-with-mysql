/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { AverageData } from './average-data';
import { BaseModel } from '../../../../models';

export class RequestDetectUpTrendDataModel  extends BaseModel {
    /**
     * #Item name: Morning judgment result
     * #British Name: am.
     * #Type: Array[object]
     * #Use explanation: Morning average data..
     */
    @ApiModelProperty()
    public am: AverageData[];

    /**
     * #Item name: Afternoon judgment result
     * #British Name: pm.
     * #Type: Array[object]
     * #Use explanation: Everning average data..
     */
    @ApiModelProperty()
    public pm: AverageData[];

    /**
     * #Item name: Day judgment result
     * #British Name: daily.
     * #Type: Array[object]
     * #Use explanation: Daily average data..
     */
    @ApiModelProperty()
    public daily: AverageData[];
}
