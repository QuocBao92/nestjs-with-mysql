import { BaseDataItemModel } from '../base-model'
import { IsNotEmpty } from 'class-validator'

// tslint:disable-next-line:no-empty-interface
interface Gender {
    Male: 1;
    Female: 2;
}
export class PatientInformation extends BaseDataItemModel {
    /**
     * #Item Name: Patient ID
     * #Use Explanation: Patient ID notified from Redox is set. 
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public mr_id: string

    /**
     * #Item Name: HeartAdvisorUserID
     * #British Name: ha_user_id 
     * #Use Explanation: UserID of Heart Advisor is set. 
     * #Type:  string
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string

    /**
     * #Item Name: Set Patient first name
     * #Use Explanation: Patient's Firstname is set. 
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public first_name: string
   
    /**
     * #Item Name: Patient's family name
     * #Use Explanation: Set Patient last name
     * #Type: string
     * #Indispensability
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public last_name: string

    /**
     * #Item Name: Patient Is MiddleName
     * #Use Explanation: Set Patient middle name
     * #Type: string
     * #Indispensability
     */
    // tslint:disable-next-line:variable-name
    public middle_name: string

    /**
     * #Item Name:Date of birth
     * #Use Explanation: Set Gender 1：male, 2：female
     * #Type: int
     * #Indispensability
     */
    @IsNotEmpty()
    public gender: number;

    /**
     * #Item Name: Age
     * #Use Explanation: The age is set. 
     * #Type: intger
     * #Indispensability
     */
    @IsNotEmpty()
    public age: number;

    /**
     * #Item Name: Phone number
     * #Use Explanation: phone_number
     * #Type: sring
     */
    // tslint:disable-next-line:variable-name
    public phone_number: string;
    /**
     * #Item Name: Date of birth
     * #Use Explanation:Set Date of birth
     * #Type: Date - date (ISO8601 format)
     * #Indispensability
     */
    @IsNotEmpty()
    public birth: Date
}