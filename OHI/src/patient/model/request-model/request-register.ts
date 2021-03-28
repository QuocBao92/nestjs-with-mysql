import BaseModel from 'src/model/base-model';
import { ApiModelProperty } from '@nestjs/swagger';
export class RequestRegister extends BaseModel {

    @ApiModelProperty() 
    // tslint:disable-next-line:variable-name
    public ha_user_id: string;

    @ApiModelProperty() 
    // tslint:disable-next-line:variable-name
    public contract_weight_scale:number;

    @ApiModelProperty() 
    // tslint:disable-next-line:variable-name
    public smartphone_use: number;

    @ApiModelProperty() 
    // tslint:disable-next-line:variable-name
    public ha_regist_date: string;

}