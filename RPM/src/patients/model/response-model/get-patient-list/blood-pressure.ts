/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty, Length } from 'class-validator';

import { BaseModel } from '../../../../models';

export class BloodPressure extends BaseModel {

  /**
   * #Item Name: Vital data last measurement date
   * #British name: last_update
   * #Type: string
   */
  @Length(10)
  // tslint:disable-next-line:variable-name
  public last_update?: string;

  /**
   * #Item Name: Mean systolic blood pressure
   * #British name: day_sys_latest
   * #Type: number
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public day_sys_latest?: number;

  /**
   * #Item Name: Mean diastolic blood pressure
   * #British name: day_dia_latest
   * #Type: number
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public day_dia_latest?: number;

  /**
   * #Item Name: Target systolic blood pressure
   * #British name: sys_target
   * #Type: number
   */
  // tslint:disable-next-line:variable-name
  public sys_target?: number;

  /**
   * #Item Name: Target diastolic blood pressure
   * #British name: dia_target
   * #Type: number
   */
  // tslint:disable-next-line:variable-name
  public dia_target?: number;

  /**
   * #Item Name: Threshold systolic blood pressure
   * #British name: sys_threshold
   * #Type: number
   */
  // tslint:disable-next-line:variable-name
  public sys_threshold?: number;

  /**
   * #Item Name: Threshold diastolic blood pressure
   * #British name: dia_threshold
   * #Type: number
   */
  // tslint:disable-next-line:variable-name
  public dia_threshold?: number;

  /**
   * #Item Name: Average pulse rate
   * #British name: day_pulse_latest
   * #Type: number
   */
  // tslint:disable-next-line:variable-name
  public day_pulse_latest?: number;

  /**
   * #Item Name: Number of times the blood pressure threshold has been exceeded
   * #British name: threshold_excess_num
   * #Type: number
   */
  // tslint:disable-next-line:variable-name
  public threshold_excess_num?: number;

  /**
   * #Item Name: Number of blood pressure measurements
   * #British name: meas_num
   * #Type: number
   */
  // tslint:disable-next-line:variable-name
  public meas_num: number;

  /**
   * #Item Name: Irregular pulse rate
   * #British name: ihb_rate
   * #Type: number
   */
  // tslint:disable-next-line:variable-name
  public ihb_rate: number;

  /**
   * #Item Name: Side effect rate
   * #British name: side_effect_rate
   * #Type: number.
   */
  // tslint:disable-next-line:variable-name
  public side_effect_rate?: number;

  /**
   * #Item Name: Auto triage rank (average on blood pressure nearest day)
   * #British name: rank_sys
   * #Type: number.
   * #Use explanation: 0:1 without rank: L and 2: M and 3: MH and 4: H
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public rank_sys: number;

  /**
   * #Item Name: Auto triage rank (average on blood pressure nearest day)
   * #British name: rank_dia
   * #Type: number.
   * #Use explanation: 0:1 without rank: L and 2: M and 3: MH and 4: H
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public rank_dia: number;

  /**
   * #Item Name: Auto triage rank (average on pulse nearest day)
   * #British name: rank_pulse
   * #Type: number.
   * #Use explanation: 0:1 without rank: L and 2: M and 3: MH and 4: H
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public rank_pulse: number;

  /**
   * #Item Name: Auto triage rank (blood pressure threshold excess ratio)
   * #British name: rank_excess_rate
   * #Type: number.
   * #Use explanation: 0:1 without rank: L and 2: M and 3: MH and 4: H
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public rank_excess_rate: number;

  /**
   * #Item Name: Auto triage rank (irregular pulse wave generation ratio)
   * #British name: rank_ihb_rate
   * #Type: number.
   * #Use explanation: 0:1 without rank: L and 2: M and 3: MH and 4: H
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public rank_ihb_rate: number;

  /**
   * #Item Name: Auto triage rank (side effect rate)
   * #British name: rank_side_effect_rate
   * #Type: number.
   * #Use explanation: 0:1 without rank: L and 2: M and 3: MH and 4: H
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public rank_side_effect_rate: number;

  /**
   * #Item Name: Auto Triage Rank (Notice Message)
   * #British name: rank_notice
   * #Type: number.
   * #Use explanation: 0:1 without rank: L and 2: M and 3: MH and 4: H
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public rank_notice: number;

  /**
   * #Item Name: Auto triage point (average of systolic blood pressure)
   * #British name: point_sys
   * #Type: number.
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public point_sys: number;

  /**
   * #Item Name: Auto triage point (average of diastolic blood pressure)
   * #British name: point_dia
   * #Type: number.
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public point_dia: number;

  /**
   * #Item Name: Auto triage point (average of the most recent pulse)
   * #British name: point_pulse
   * #Type: number.
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public point_pulse: number;

  /**
   * #Item Name: Auto triage point (blood pressure threshold excess rate)
   * #British name: point_excess_rate
   * #Type: number.
   * #Use explanation: 0:1 without rank: L and 2: M and 3: MH and 4: H
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public point_excess_rate: number;

  /**
   * #Item Name: Auto triage point (irregular pulse wave generation rate)
   * #British name: point_ihb_rate
   * #Type: number.
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public point_ihb_rate: number;

  /**
   * #Item Name: Auto Triage Point (Rate of occurrence of side effects)
   * #British name: point_side_effect_rate
   * #Type: number.
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public point_side_effect_rate: number;

  /**
   * #Item Name: Notice message
   * #British name: notice
   * #Type: number
   */
  @IsNotEmpty()
  public notice: number;

}
