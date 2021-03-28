/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '../../../models';
export class RequestBloodPressureDetail extends BaseModel {
  /**
   * #Item name: Acquisition start date of period
   * #British name: date_from
   * #Type: string
   * #Use explanation: When page sending button is pressed, and it changes from other detailed screens, it uses it.
   */
  @ApiModelProperty()
  // tslint:disable-next-line:variable-name
  public date_from: string;

  /**
   * #Item name: Acquisition end date of period
   * #British name: date_to
   * #Type: string
   * #Use explanation: When page sending button is pressed, and it changes from other detailed screens, it uses it.
   */
  @ApiModelProperty()
  // tslint:disable-next-line:variable-name
  public date_to: string;
}
