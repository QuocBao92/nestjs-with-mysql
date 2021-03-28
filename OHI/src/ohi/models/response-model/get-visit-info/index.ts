import { Result } from '../base-model';
import { IndividualPatientsInformation } from './individual_patients_information';
import { IsNotEmpty } from 'class-validator';


export class GetVisitInfo{
    

    @IsNotEmpty()
    public result: Result

    /**
     * UserID of Heart Advisor is set. 
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string

    // tslint:disable-next-line:variable-name
    public visit_data: IndividualPatientsInformation[]
}