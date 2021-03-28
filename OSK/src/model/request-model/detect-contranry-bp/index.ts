import { ApiModelProperty } from '@nestjs/swagger';
import { RequestDetectContraryTrendDataModel } from './detect-contrarytrend-model';
import { BaseModel } from '../../../models';

export class RequestDetectContraryTrendsBpAndPulse extends BaseModel {
    /**
     * #Item name: Vital data
     * #British Name: data
     * #Type: Object
     * #Use explanation: Average data for each vital.
     */
    @ApiModelProperty()
    data: RequestDetectContraryTrendDataModel;

    /**
     * #Item name: Note
     * #British Name: memo
     * #Type: string
     * #Use explanation: Traces processing on the server from client requests..
     */
    @ApiModelProperty({required: false})
    memo: string;
}
