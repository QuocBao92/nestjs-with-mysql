import { Result } from '../base-model';
import { VitalDataAverage } from './vital-data-average';
import BaseModel from '../../../../model/base-model';
import { IsNotEmpty } from 'class-validator';

export class GetVitalAverageData extends BaseModel {
    /**
     * #Name: Result
     * #Parameter Name: result
     */
    @IsNotEmpty()
    public result: Result

    /**
     * #Name: HeartAdvisorUserID    
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name   
    public ha_user_id: string

    /**
     * #Name: Vital data (Blood Pressure)
     */
    // tslint:disable-next-line:variable-name
    public vital_data: VitalDataAverage[]
}