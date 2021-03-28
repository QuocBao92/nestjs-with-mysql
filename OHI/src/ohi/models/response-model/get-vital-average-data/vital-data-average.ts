import BaseModel from '../../../../model/base-model';
import { IsNotEmpty } from 'class-validator';

export class VitalDataAverage extends BaseModel {

    /**
     * #Name: Measurement Date
     * #Usage: Set Measurement Date
     */
    @IsNotEmpty()
    public date : Date

    /**
     * #Name: Systolic Morning Average blood pressure
     * #Usage: Set Measurement Date
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_avg_morning: string

    /**
     * #Name: Systolic Evening Average blood pressure
     * #Usage: Set Measurement Date
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_avg_evening: string

    /**
     * #Name: Systolic Evening Average blood pressure
     * #Usage: Set Measurement Date
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_avg_day: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public sys_avg_office: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_avg_morning: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_avg_evening: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_avg_day: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public dia_avg_office: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public pulse_avg_morning: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public pulse_avg_evening: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public pulse_avg_day: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public pulse_avg_office: string

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public updated_at: number
    
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public created_at: number
}