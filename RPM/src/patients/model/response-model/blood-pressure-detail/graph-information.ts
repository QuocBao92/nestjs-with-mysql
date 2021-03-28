/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty, Length } from 'class-validator';
import { BaseModel } from '../../../../models';

export class GraphInformation extends BaseModel {

  /**
   * #Item Name: Measurement day
   * #British name: date
   * #Type: string
   * #Use explanation: Measurement day
   */
  @IsNotEmpty()
  @Length(10)
  public date: string;

  /**
   * #Item Name: Rank
   * #British name: rank_total
   * #Type: number
   * #Use explanation:: 0:without rank  1: L and 2: M and 3: MH and 4: H . Graph tab badge display in case of "4:H"
   */
  @Length(10)
  // tslint:disable-next-line:variable-name
  public rank_total: number;

  /**
   * #Item Name: Systolic blood pressure morning average.
   * #British name: sys_avg_morning
   * #Type: number
   * #Use explanation: Mean value of the measurement height blood pressure at morning of measurement day
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public sys_avg_morning?: number;

  /**
   * #Item Name: Diastolic morning average.
   * #British name: dia_avg_morning
   * #Type: number
   * #Use explanation: Mean value of measuring the lowest blood pressure at morning of measurement day
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public dia_avg_morning: number;

  /**
   * #Item Name: Pulse morning average
   * #British name: pulse_avg_morning
   * #Type: number
   * #Use explanation: Mean value of measurement pulse at morning of measurement day
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public pulse_avg_morning: number;

  /**
   * #Item Name: Systolic blood pressure night average
   * #British name: sys_avg_evening
   * #Type: number
   * #Use explanation: Mean value of the measurement height blood pressure at night of measurement day
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public sys_avg_evening: number;

  /**
   * #Item Name: Minimum blood pressure night average
   * #British name: dia_avg_evening
   * #Type: number
   * #Use explanation: Mean value of measuring the lowest blood pressure at night of measurement day
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public dia_avg_evening: number;

  /**
   * #Item Name: Pulse night average
   * #British name: pulse_avg_evening
   * #Type: number
   * #Use explanation: Mean value of measurement pulse at night of measurement day
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public pulse_avg_evening: number;

  /**
   * #Item Name: Examination room systolic blood pressure average
   * #British name: sys_avg_office
   * #Type: number
   * #Use explanation: Mean value of the examination room input height blood pressure on measurement day
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public sys_avg_office: number;

  /**
   * #Item Name: Examination room mean diastolic blood pressure
   * #British name: dia_avg_office
   * #Type: number
   * #Use explanation:: Mean value of the examination room input lowest blood pressure on measurement day
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public dia_avg_office: number;

  /**
   * #Item Name: Examination room pulse average
   * #British name: pulse_avg_office
   * #Type: number
   * #Use explanation:: Mean value of examination room input pulse on measurement day
   */
  @Length(999)
  // tslint:disable-next-line:variable-name
  public pulse_avg_office: number;

  /**
   * #Item Name: Measurement state
   * #British name: meas_state
   * #Type: number
   * #Use explanation:: Displayed state of measurement.
   * 0: Missing 1: irregular pulse wave 2: There is a body motion 3: The [kafu] rolling state is abnormal.
   */
  @IsNotEmpty()
  @Length(10)
  // tslint:disable-next-line:variable-name
  public meas_state: number;

  /**
   * #Item Name: Irregular pulse wave count
   * #British name: ihb_count
   * #Type: number
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public ihb_count: number;

  /**
   * #Item Name: Morning measurement state
   * #British name: meas_state_morning
   * #Type: Array[integer]
   * #Use explanation:: The code corresponding to the state of the measurement is set by switching off the comma district.
   * 1:Arrhythmia having and 2: Body motion having and 3: State NG of [kafu] rolling
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public meas_state_morning: number[];

  /**
   * #Item Name: Evening measurement state
   * #British name: meas_state_evening
   * #Type: Array[integer]
   * #Use explanation:: The code corresponding to the state of the measurement is set by switching off the comma district.
   * 1:Arrhythmia having and 2: Body motion having and 3: State NG of [kafu] rolling
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public meas_state_evening: number[];

  /**
   * #Item Name: Side effect
   * #British name: side_effects
   * #Type: Array[integer]
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public side_effects: number[];

  /**
   * #Item Name: Medication
   * #British name: take_rate
   * #Type: number
   * #Use explanation: 0 to 100: Medication rate.
   */
  // tslint:disable-next-line:variable-name
  public take_rate: number;
}
