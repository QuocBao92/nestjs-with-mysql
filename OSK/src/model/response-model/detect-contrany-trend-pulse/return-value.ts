import { SysObject } from './sys-object';
import { DiaObject } from './dia-object';
import { BaseModel } from '../../../models';

export class ReturnValueObject extends BaseModel {
    /**
     * #Item name: Systolic blood pressure
     * #British Name: sys.
     * #Type: number.
     * #Use explanation: systolic blood pressure value on the date specified by date
     */
    public sys: SysObject;

    /**
     * #Item name: diastolic blood pressure
     * #British Name: dia.
     * #Type: number.
     * #Use explanation: diastolic blood pressure value on the date specified by date
     */
    public dia: DiaObject;
}
