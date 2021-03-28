import { BaseDataItemModel } from '../base-model'
import { IsNotEmpty, Length } from 'class-validator'

export class VitalInformationWeight extends BaseDataItemModel {
    /**
     * #Item name: Measurement date
     * #Indispensability:  true 
     * #Type: epoch timestamp
     * #Use explanation: The measurement date is set. 
     */
    @IsNotEmpty()
    public date: number
    
    /**
     * #Item name: Measurement time of date zone
     * #Indispensability: true 
     * #Type: string
     * #Use explanation: The time zone of the measurement date is set. 
     */
    @IsNotEmpty()
    public timezone: string

    /**
     * #Item name: Weight (kg)
     * #Indispensability: true 
     * #Type: string
     * #Use explanation: The weight of unit kg is set. 
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public weight_kg : string
    

    /**
     * #Item name: Weight (pound)
     * #Indispensability: true 
     * #Type: string
     * #Use explanation: The weight of unit kg is set. 
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public weight_lbs: string

    /**
     * #Item name: BMI
     * #Indispensability: true 
     * #Type: string
     * #Use explanation: BMI is set. 
     */
   
    public bmi: string

    
    /**
     * #Item name: Automatic operation/person input flag
     * #Type: string
     * #Use explanation: The vital input method is set. 1:Automatic operation and 2: Manual input
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public input_type: number;

    /**
     * #Item name: Delete flag
     * #Type: integer
     * #Use explanation: Set whether data has been deleted. Not deleted: 0, Deleted: 1
     */
    @IsNotEmpty()
    @Length(0, 1)
    public delete: number;
    
}