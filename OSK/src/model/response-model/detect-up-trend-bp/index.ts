import { BaseModel } from '../../../models';
import { ReturnValueObject } from './return-value';

export class ResponseDetectUpTrendBP extends BaseModel {

    /**
     * #British Name: returnedValue
     * #Type: Object
     * #Use explanation: Average data for each vital.
     */
    public returnedValue: ReturnValueObject;
}
