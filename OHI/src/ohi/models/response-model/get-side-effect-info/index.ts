import { InformationOnSideEffect } from './information_on_side_effect';
import { IsNotEmpty } from 'class-validator';
import { Result } from '../base-model';

export class GetSiteEffectInfo  {

    /**
     * #Name: Result
     * #Parameter Name: result
     */
    public result: Result

    /**
     * UserID of Heart Advisor is set. 
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string

    /**
     * Array of information on side effect generation day It sets it in new day the order. 
     */
    // tslint:disable-next-line:variable-name
    public side_effect_info: InformationOnSideEffect[]
}