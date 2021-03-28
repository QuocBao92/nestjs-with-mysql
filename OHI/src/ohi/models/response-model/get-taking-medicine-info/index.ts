import { Result } from '../base-model';
import { TakeDateInfo } from './take-date-info';
import { IsNotEmpty } from 'class-validator';
import BaseModel from 'src/model/base-model';

export class GetTakingMedicineInfo extends BaseModel {

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
    // tslint:disable-next-line:variable-name

    /**
     * Array of information on day of taking medicine
     */
    // tslint:disable-next-line:variable-name
    public take_date_info: TakeDateInfo[]
}