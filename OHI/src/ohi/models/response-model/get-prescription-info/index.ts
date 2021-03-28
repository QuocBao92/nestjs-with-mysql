import { Result } from '../base-model'
import { MedicinesInformation } from './medicines-information'
import { IsNotEmpty } from 'class-validator'
import BaseModel from '../../../../model/base-model'


export class GetPrescriptionInfo extends BaseModel  {
    /**
     * #Name: Result
     * #Parameter Name: result
     */
    @IsNotEmpty()
    public result: Result

    /**
     * UserID of Heart Advisor is set. 
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string

    /**
     * Array of medicine information
     */
    public medicines: MedicinesInformation[]
}