import BaseModel from '../../../../model/base-model'
import { IsNotEmpty } from 'class-validator'

    //tslint:disable
export class TakeDateInfo extends BaseModel {
    
    /**
     * #Item Name: Day of taking medicine 
     * #Use Explanation: The day of taking medicine is set. 
     * #Type: date(Localtime)(ISO8601 format)
     * #Indispensability: true
     */
    @IsNotEmpty()
    public take_date: Date

    /**
     * Start date of taking medicine
     */
    public updated_at: number

    /**
     * End date of taking medicine
     */
    public created_at: number
  
}