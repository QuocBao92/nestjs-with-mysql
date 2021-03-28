import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';
import { RequestDetectBradycarDiaDataModel } from './detect-bradicar-model';

export class RequestDetectBradycarDia extends BaseModel {
    /**
     * #Item name: Vital data
     * #British Name: data
     * #Type: Object
     * #Use explanation: Average data for each vital.
     */
    @ApiModelProperty()
    public data: RequestDetectBradycarDiaDataModel;

    /**
     * #Item name: Note
     * #British Name: memo
     * #Type: string
     * #Use explanation: Traces processing on the server from client requests..
     */
    @ApiModelProperty({required: false})
    public memo: string;
}
