import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';
export class RequestDetectDetectLowBPDataModel extends BaseModel {
    /**
     * #Item name: Date
     * #British Name: date.
     * #Type: string
     * #Use explanation: Date format is "YYYY / MM / DD". .
     */
    @ApiModelProperty()
    public date: string;

    /**
     * #Item name: Systolic blood pressure
     * #British Name: sys.
     * #Type: number.
     * #Use explanation: systolic blood pressure value on the date specified by date
     */
    @ApiModelProperty()
    public sys: number;

    /**
     * #Item name: diastolic blood pressure
     * #British Name: dia.
     * #Type: number.
     * #Use explanation: diastolic blood pressure value on the date specified by date
     */
    @ApiModelProperty()
    public dia: number;

    /**
     * #Item name: Pulse.
     * #British Name: pulse.
     * #Type: number.
     * #Use explanation: Pulse value of the date specified by date
     */
    @ApiModelProperty()
    public pulse: number;
}
