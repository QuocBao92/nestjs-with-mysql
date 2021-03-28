import { Result, BaseDataItemModel } from '../base-model';
import { BloodpressureInfor } from './blood-pressure-info';

//tslint:disable
export class GetPersonalBPInfoModel extends BaseDataItemModel {

    /**
     * #Name: Result
     * #Parameter Name: result
     */
    public result: Result

    /**
     * #Name: Blood pressure information
     * #Parameter Name: bp_info
     */
    public bp_info: BloodpressureInfor[]

}