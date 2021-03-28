/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../../models';

export class BaseRequest extends BaseModel {

    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public access_token: string;
}
