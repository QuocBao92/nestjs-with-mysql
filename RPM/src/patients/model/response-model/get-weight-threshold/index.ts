/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { BaseModel, Result } from '../../../../models';
import { DefaultInformation } from './default-information';
import { IsNotEmpty } from 'class-validator';
import { ThresholdInformation } from './threshold-information';

export class GetWeightThreshold extends BaseModel {

  /**
   * #Item Name: Result
   * #Use Explanation: result
   * #Type: object
   */
  @IsNotEmpty()
  public result: Result;

  /**
   * #Item Name: Threshold
   * #Use Explanation:Weight threshold
   * #Type: Array[object]
   */
  @IsNotEmpty()
  public threshold: ThresholdInformation[];

  /**
   * #Item Name: Initial setting value
   * #Use Explanation: Parameter when weight threshold setting is reset
   * #Type: Array[object]
   */
  @IsNotEmpty()
  public init: DefaultInformation[];

  /**
   * #Item Name: Weight threshold setting upper limit
   * #British Name: threshold_max
   * #Type: number
   * #Indispensability: true
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public threshold_max: number;

  /**
   * #Item Name: Weight threshold setting lower limit
   * #British Name: threshold_min
   * #Type: number
   * #Indispensability: true
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public threshold_min: number;

  /**
   * #Item Name: Weight period setting upper limit
   * #British Name: period_max
   * #Type: number
   * #Indispensability: true
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public period_max: number;

  /**
   * #Item Name: Weight period setting lower limit
   * #British Name: period_min
   * #Type: number
   * #Indispensability: true
   */
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  public period_min: number;
}
