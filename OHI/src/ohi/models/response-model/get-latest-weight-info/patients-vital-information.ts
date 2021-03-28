import { BaseDataItemModel } from '../base-model'
import { IsNotEmpty } from 'class-validator'

export class PatientsVitalInformation extends BaseDataItemModel {

    /**
     * #Item Name: HeartAdvisorUserID
     * #Use Explanation: UserID of Heart Advisor is set. 
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string

    /**
     * #Item Name: Measurement date
     * #Use Explanation: The measurement date is set. 
     * #Type: string - Spoch timestamp
     * #Indispensability: true
     */
    @IsNotEmpty()
    public date: number

    /**
     * #Item Name: Measurement time of date zone
     * #Use Explanation: The time zone of the measurement date is set. 
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    public timezone: string

    /**
     * #Item Name: Weight (kg)
     * #Use Explanation: The weight of unit kg is set. 
     * #Type: integer
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public weight_kg: string

    /**
     * #Item Name: Weight (lbs)
     * #Use Explanation: The weight of unit kg is set. 
     * #Type: integer
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public weight_lbs: string

    /**
     * #Item Name: BMI
     * #Use Explanation: BMI is set. 
     * #Type: integer
     * #Indispensability: true
     */
    public bmi: string

    /**
     * #Item Name: Automatic operation/person input flag
     * #Use Explanation: The vital input method is set. 1:Automatic operation and 2: Person input
     * #Type: integer
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public input_type: number

}