import BaseModel from '../../../../model/base-model'
import { IsNotEmpty } from 'class-validator'

export class BaseDataItemModel extends BaseModel {
    
    /**
     * #Item Name: Updated day and hour
     * #Use Explanation: Updated day and hour are set. 
     * #Type: string - epoch timestamp
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public updated_at: number

    /**
     * #Item Name: Date and time of creation
     * #Use Explanation: The date and time of creation is set. 
     * #Type: string - epoch timestamp
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public created_at: number
}