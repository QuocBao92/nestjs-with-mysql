/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty, Length } from 'class-validator';
import { BaseModel } from '../../../../models';

export class MedicationInformation extends BaseModel {

    /**
     * #Item Name: Medicine name
     * #British name: name
     * #Type: string.
     */
    @IsNotEmpty()
    public name: string;

    /**
     * #Item Name: Dosage
     * #British name: quantity
     * #Type: string
     */
    @IsNotEmpty()
    public quantity: string;

    /**
     * #Item Name: Start of medication day
     * #British name: dosing_start
     * #Type: string
     */
    @Length(10)
    // tslint:disable-next-line:variable-name
    public dosing_start?: string;

    /**
     * #Item Name: End of dosing day
     * #British name: dosing_end
     * #Type: string
     */
    @Length(10)
    // tslint:disable-next-line:variable-name
    public dosing_end?: string;

    /**
     * #Item Name: Start date of taking medicine
     * #British name: ingestion_start
     * #Type: string
     * #Use explanation:: Period when bar of administering schedule is displayed in blue.
     * It offers it in the form of "YYYY-MM-DD".
     */
    @Length(10)
    // tslint:disable-next-line:variable-name
    public ingestion_start?: string;

    /**
     * #Item Name: End date of taking medicine
     * #British name: ingestion_end
     * #Type: string
     * #Use explanation:: Period when bar of administering schedule is displayed in blue.
     * It offers it in the form of "YYYY-MM-DD".
     */
    @Length(10)
    // tslint:disable-next-line:variable-name
    public ingestion_end?: string;
}
