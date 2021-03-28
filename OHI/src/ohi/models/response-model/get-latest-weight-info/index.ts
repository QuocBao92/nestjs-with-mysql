import { Result } from '../base-model'
import { PatientsVitalInformation } from './patients-vital-information'
import BaseModel from '../../../../model/base-model'

//tslint:disable
export class GetLatestWeightInfo extends BaseModel {
    /**
     * result
     */
    public result: Result

    /**
     * #Item Name: Data
     * #British Name: data
     * #Use Explanation: Array of patient's vital information It sets it in order of id specified by the request parameter. 
     * #Type: array
     */
    public data: PatientsVitalInformation[]
}