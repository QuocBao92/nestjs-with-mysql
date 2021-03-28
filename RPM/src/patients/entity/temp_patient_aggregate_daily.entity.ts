/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
/**
 * When running batch data will be update into temp_patient_aggregate_daily table
 * When the batch is run successfully, the data will move from temp_patient_aggregate_daily to d_patient_aggregate_daily
 * and delete the record at temp_patient_aggregate_daily
 */
import { Column, Entity } from 'typeorm';
@Entity('temp_patient_aggregate_daily')

export class TempPatientAggregateDaily {
     /**
      * #British Name: ha_user_id
      * #Use Explanation: HeartAdvisorUserID.
      * #Type: string
      * #Indispensability: true
      */
     @Column({ type: 'char', length: 64, nullable: false, primary: true })
     // tslint:disable-next-line:variable-name
     public ha_user_id: string;

     /**
      * #British Name: measurement_date
      * #Use Explanation: Measurement day.
      * #Type: string
      * #Indispensability: true
      */
     @Column({ type: 'date', nullable: false, primary: true })
     // tslint:disable-next-line:variable-name
     public measurement_date: string;

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
      * #British Name: algo1
      * #Use Explanation: Response json of blood pressure Argo API "DetectUpTrendBP".
      * #Type: number
      * #Indispensability: false
      */
     @Column({ type: 'text', nullable: true, default: null })
     public algo1: string;

     /**
      * #British Name: algo2
      * #Use Explanation: Response json of blood pressure Argo API "DetectDownTrendBP".
      * #Type: string
      * #Indispensability: false
      */
     @Column({ type: 'text', nullable: true, default: null })
     public algo2: string;

     /**
      * #British Name: algo3
      * #Use Explanation: Response json of blood pressure Argo API "DetectContraryTrendsBPandPulse".
      * #Type: string
      * #Indispensability: false
      */
     @Column({ type: 'text', nullable: true, default: null })
     public algo3: string;

     /**
      * #British Name: algo4
      * #Use Explanation: Response json of blood pressure Argo API "DetectLowBP".
      * #Type: string
      * #Indispensability: false
      */
     @Column({ type: 'text', nullable: true, default: null })
     public algo4: string;

     /**
      * #British Name: algo5
      * #Use Explanation: Response json of blood pressure Argo API "DetectLowBP".
      * #Type: string
      * #Indispensability: false
      */
     @Column({ type: 'text', nullable: true, default: null })
     public algo5: string;

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
      * #Use Explanation: Record updated day and hour.
      * #Type: string
      * #Indispensability: true
      */
     @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
     // tslint:disable-next-line:variable-name
     public update_date: string;
}
