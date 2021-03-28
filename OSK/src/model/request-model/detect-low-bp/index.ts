import { RequestDetectDetectLowBPDataModel } from './detect-up-model';
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';

export class RequestDetectLowBP extends BaseModel {

    /**
     * #Item name: Vital data
     * #British Name: data
     * #Type: Object
     * #Use explanation: Average data for each vital.
     */
    @ApiModelProperty()
    public data: RequestDetectDetectLowBPDataModel[];

    /**
     * #Item name: Note
     * #British Name: memo
     * #Type: string
     * #Use explanation: Traces processing on the server from client requests..
     */
    @ApiModelProperty({required: false})
    public memo: string;
}
