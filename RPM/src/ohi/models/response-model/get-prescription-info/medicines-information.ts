/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { IsNotEmpty } from 'class-validator';
import { BaseDataItemModel } from '../base-model';

export class MedicinesInformation extends BaseDataItemModel {

    /**
     * #Item Name: Medicine id
     * #British Name: medicine_id
     * #Use Explanation: Id of the medicine is set.
     * #Type: integer
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public medicine_id: number;

    /**
     * #Item Name: Medicine name
     * #Use Explanation: The medicine name is set.
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public medicine_name: string;

    /**
     * #Item Name: Quantity
     * #Use Explanation: Set Quantity of medicine.
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    public quantity: string;

    /**
     * #Item Name: Unit
     * #Use Explanation: The unit of the amount of the medicine is set.
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    public units: string;

    /*
     * #Item Name: Start of medication day
     * #Use Explanation: The start of medication day is set.
     * #Type: date(Localtime) (ISO8601 format)
     * #Indispensability: true
     */
    public start?: Date;

    /**
     * #Item Name: End of dosing day
     * #British Name: end
     * #Use Explanation: The end of dosing day is set.
     * #Type: date(Localtime) (ISO8601 format)
     * #Indispensability: true
     */
    public end?: Date;

    /**
     * #Item Name: taking_start
     * #British Name: taking_start
     * #Use Explanation: In the set administering period, the start date of taking medicine that the patient set is set.
     * #Type: date(Localtime) (ISO8601 format)
     * #Indispensability: true
     */
    // tslint:disable-next-line:variable-name
    public taking_start?: Date;

    /**
     * #Item Name: taking_end
     * #British Name: taking_end
     * #Use Explanation: In the set administering period, the end date of taking medicine that the patient set is set.
     * #Type: date(Localtime) (ISO8601 format)
     * #Indispensability: true
     */
    // tslint:disable-next-line:variable-name
    public taking_end?: Date;
}
