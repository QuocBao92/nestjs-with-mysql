import { Result } from '../base-model/base-result'
import BaseModel from '../../../../model/base-model';
import { IsNotEmpty } from 'class-validator';

    //tslint:disable
export class GetReferenceInfoModel extends BaseModel {
    /**
     * #Item Name: Result
     */
    public result: Result

    /**
     * #Item Name: HeartAdvisorUserID
     */
    @IsNotEmpty()
    // tslint:disable-next-line: variable-name
    public ha_user_id: string

    /**
     * #Item Name: Date reference
     * #Description: Set the reference date 
     * (the day after the latest medication start date)
     */
    // tslint:disable-next-line: variable-name
    public reference_date: Date


    /**
     * #Name: Elapsed Days since Reference Date
     * #Item Name: Calculation_duration
     */
    // tslint:disable-next-line: variable-name
    public calculation_duration: number;

    /**
     * #Item Name: ihb
     */
    public ihb: string;

    /**
     * #Item Name: Updated day and hour
     * #Use Explanation: Updated day and hour are set. 
     * #Type: string - epoch timestamp.
     * #Indispensability: true.
     */
    @IsNotEmpty()
    public updated_at: number;

    /**
     * #Item Name: Date and time of creation
     * #Use Explanation: The date and time of creation is set. 
     * #Type: string - epoch timestamp
     * #Indispensability: true
     */
    @IsNotEmpty()
    public created_at: number;
}