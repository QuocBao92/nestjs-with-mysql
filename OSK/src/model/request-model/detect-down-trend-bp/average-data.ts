import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';
export class AverageData extends BaseModel {

    /**
     * #Item name: Date
     * #British Name: date.
     * #Type: string
     * #Use explanation: Date format is "YYYY / MM / DD". .
     */
    @ApiModelProperty()
    public date: string;

    /**
     * #Item name: Systolic blood pressure average
     * #British Name: sys_ave.
     * #Type: number.
     * #Use explanation: Average value of morning systolic blood pressure on the date specified by date.
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public sys_ave: number;

    /**
     * #Item name: Average diastolic blood pressure
     * #British Name: dia_ave.
     * #Type: number.
     * #Use explanation: Average value of diastolic blood pressure in the morning on the date specified by date
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public dia_ave: number;

    /**
     * #Item name: Pulse average
     * #British Name: pulse_ave.
     * #Type: number.
     * #Use explanation: Average value of the morning pulse on the date specified by date.
     */
    @ApiModelProperty()
    // tslint:disable-next-line:variable-name
    public pulse_ave: number;

}
