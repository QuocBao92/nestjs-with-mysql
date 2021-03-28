import BaseModel from 'src/model/base-model'

export class RequestRegisterUser extends BaseModel{

    // tslint:disable-next-line:variable-name
    public ha_user_id: string[]

    // tslint:disable-next-line:variable-name
    public contract_weight_scale: number

    // tslint:disable-next-line:variable-name
    public ha_regist_date: Date

}