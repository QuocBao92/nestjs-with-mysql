import { ReturnValueObject } from './return-value';
import { BaseModel } from '../../../models';

export class ResponseDetectContraryTrendsAndPulse extends BaseModel {
    /**
     * #British Name: returnedValue
     * #Type: Object
     * #Use explanation: Average data for each vital.
     */
    public returnedValue: ReturnValueObject;
}
