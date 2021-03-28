import { Result } from '../base-model/base-result'
import { PatientInformation } from './patient-information'
import BaseModel from '../../../../model/base-model';
export class GetPersonalInfoModel extends BaseModel {

    public result: Result
    
    /**
     * #Item Name: Data
     * #Use Explanation: Array of patient information It sets it in order of id specified by the request parameter. 
     * #Type: array
     */
    public data: PatientInformation[]
}