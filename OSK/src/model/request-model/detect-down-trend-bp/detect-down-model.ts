import { AverageData } from './average-data';
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';

export class RequestDetectDownTrendBpDataModel extends BaseModel {
    /**
     * #Item name: Morning average data
     * #British Name: AverageData.
     * #Type: Array object
     * #Use explanation: Morning average data..
     */
    @ApiModelProperty()
    public am: AverageData[];

    /**
     * #Item name: Everning average data
     * #British Name: AverageData.
     * #Type: Array object
     * #Use explanation: Everning average data..
     */
    @ApiModelProperty()
    public pm: AverageData[];

    /**
     * #Item name: Daily average data
     * #British Name: AverageData.
     * #Type: Array object
     * #Use explanation: Daily average data..
     */
    @ApiModelProperty()
    public daily: AverageData[];
}
