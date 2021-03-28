import { BaseModel } from '../../../models';
import { ReturnValueObject } from './result';

export class ResponseDetectBradycarDia extends BaseModel {
    /**
     * #British Name: returnedValue
     * #Type: Object
     * #Use explanation: Average data for each vital.
     */
    public returnedValue: ReturnValueObject;
}
