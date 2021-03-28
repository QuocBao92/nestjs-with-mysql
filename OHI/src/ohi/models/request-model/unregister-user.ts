import BaseModel from 'src/model/base-model';
import { IsNotEmpty } from 'class-validator';

export class RequestUnRegisterUser extends BaseModel {
    
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string
}