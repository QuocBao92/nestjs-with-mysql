/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { Column, Entity } from 'typeorm';

@Entity({ name: 'temp_patient_aggregate' })
export class TempPatientAggregate {
  /**
   * #British Name: ha_userid
   * #Use Explanation: specify id of patient unique.
   * #Type: string
   * #Indispensability: true
   */
  @Column({ type: 'char', length: 64, nullable: false, primary: true })
  // tslint:disable-next-line:variable-name
  public ha_user_id: string;

  /**
   * #British Name: last_aggregate_date
   * #Use Explanation: Lapsed days from day of the final going to hospital regularly.
   * #Type: string
   * #Indispensability: false
   */
  @Column({ type: 'date', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public last_aggregate_date: Date;

  /**
   * #British Name: ha_request_timestamp
   * #Use Explanation: Lapsed days from day of the final going to hospital regularly.
   * #Type: string
   * #Indispensability: false
   */
  @Column({ type: 'bigint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public ha_request_timestamp?: number;

  /**
   * #British Name: last_meas_date
   * #Use Explanation: Vital data finality measurement day.
   * #Type: string
   * #Indispensability: false
   */
  @Column({ type: 'date', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public last_meas_date: Date;

  /**
   * #British Name: day_sys_latest
   * #Use Explanation: Average on maximal pressure nearest day.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'smallint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public day_sys_latest?: number;

  /**
   * #British Name: day_dia_latest
   * #Use Explanation: Average on minimal pressure nearest day.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'smallint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public day_dia_latest?: number;

  /**
   * #British Name: day_pulse_latest
   * #Use Explanation: Average on pulse nearest day.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'smallint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public day_pulse_latest: number;

  /**
   * #British Name: target_sys
   * #Use Explanation: Target systolic blood pressure
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'smallint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public target_sys: number;

  /**
   * #British Name: target_dia
   * #Use Explanation: Target diastolic blood pressure
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'smallint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public target_dia: number;

  /**
   * #British Name: threshold_sys
   * #Use Explanation: Threshold systolic blood pressure
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'smallint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public threshold_sys: number;

  /**
   * #British Name: threshold_dia
   * #Use Explanation: Threshold diastolic blood pressure
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'smallint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public threshold_dia: number;

  /**
   * #British Name: threshold_excess_num
   * #Use Explanation: Blood pressure threshold excess frequency.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'smallint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public threshold_excess_num: number;

  /**
   * #British Name: meas_num
   * #Use Explanation: Sphygmomanometry frequency.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'smallint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public meas_num: number;

  /**
   * #British Name: algo_alert
   * #Use Explanation: Blood pressure Argo abnormality check.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: false, default: 0 })
  // tslint:disable-next-line:variable-name
  public algo_alert: number;

  /**
   * #British Name: ihb_rate
   * #Use Explanation: Irregular pulse wave generation ratio.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public ihb_rate: number;

  /**
   * #British Name: side_effect_rate
   * #Use Explanation: Side effect rate.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public side_effect_rate: number;

  /**
   * #British Name: rank_total
   * #Use Explanation: Auto triage rank.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public rank_total: number;

  /**
   * #British Name: rank_sys
   * #Use Explanation: Auto triage rank sys(average on blood pressure nearest day).
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public rank_sys?: number;

  /**
   * #British Name: rank_dia
   * #Use Explanation: Auto triage rank dia (average on blood pressure nearest day).
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public rank_dia?: number;

  /**
   * #British Name: rank_pulse
   * #Use Explanation: Auto triage rank (average on pulse nearest day).
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public rank_pulse?: number;

  /**
   * #British Name: rank_excess_rate
   * #Use Explanation: Auto triage rank (blood pressure threshold excess ratio).
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public rank_excess_rate?: number;

  /**
   * #British Name: rank_ihb_rate
   * #Use Explanation: Auto triage rank (irregular pulse wave generation ratio).
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public rank_ihb_rate?: number;

  /**
   * #British Name: rank_side_effect_rate
   * #Use Explanation: Auto triage rank (side effect rate).
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public rank_side_effect_rate?: number;

  /**
   * #British Name: point_sys
   * #Use Explanation: Auto triage point (average of systolic blood pressure most recent day)
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public point_sys: number;

  /**
   * #British Name: point_dia
   * #Use Explanation: Auto triage points (average of diastolic blood pressure)
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public point_dia: number;

  /**
   * #British Name: point_pulse
   * #Use Explanation: Auto triage point (average of the most recent pulse)
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public point_pulse: number;

  /**
   * #British Name: point_excess_rate
   * #Use Explanation: Auto triage point (blood pressure threshold excess rate)
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public point_excess_rate: number;

  /**
   * #British Name: point_ihb_rate
   * #Use Explanation: Auto triage point (irregular pulse wave generation rate)
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public point_ihb_rate: number;

  /**
   * #British Name: point_side_effect_rate
   * #Use Explanation: Auto triage point (Rate of occurrence of side effects)
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true, default: null })
  // tslint:disable-next-line:variable-name
  public point_side_effect_rate: number;

  /**
   * #British Name: alert_notice_flag
   * #Use Explanation: Blood pressure alert notification flag.
   * #Type: number
   * #Indispensability: false
   */
  @Column({ type: 'tinyint', nullable: true, default: null, comment: '0: Not required, 1: Not notified, 2: Notified' })
  // tslint:disable-next-line:variable-name
  public alert_notice_flag: number;

  /**
   * #British Name: regist_date
   * #Use Explanation: At the record registration date.
   * #Type: string
   * #Indispensability: true
   */
  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line:variable-name
  public regist_date: string;

  /**
   * #British Name: update_date
   * #Use Explanation:Record updated day and hour.
   * #Type: string
   * #Indispensability: true
   */
  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line:variable-name
  public update_date: string;
}
