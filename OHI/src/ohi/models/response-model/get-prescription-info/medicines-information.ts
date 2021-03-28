import { BaseDataItemModel } from '../base-model';
import { IsNotEmpty } from 'class-validator';

// tslint:disable
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
    public medicine_id: number

    /**
     * #Item Name: Medicine name
     * #Use Explanation: The medicine name is set.  
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public medicine_name: string

    /**
     * #Item Name: Amount
     * #Use Explanation: The amount of the medicine is set.
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    public quantity: string

    /**
     * #Item Name: Unit
     * #Use Explanation: The unit of the amount of the medicine is set. 
     * #Type: string
     * #Indispensability: true
     */
    @IsNotEmpty()
    public units : string

    /**
     * #Item Name: Start of medication day 
     * #Use Explanation: The start of medication day is set. 
     * #Type: date(Localtime) (ISO8601 format)
     * #Indispensability: true
     */
    public start? : Date

    /**
     * #Item Name: End of dosing day
     * #British Name: end
     * #Use Explanation: The end of dosing day is set. 
     * #Type: date(Localtime) (ISO8601 format)
     * #Indispensability: true
     */
    public end? : Date

      /**
     * #Item Name: Taking Medicine start date
     * #Use Explanation: Set Taking Medicine Start Date for the predetermined patient within the defined prescription period.
     * #Type: date(Localtime) (ISO8601 format)
     * #Indispensability: true
     */
    public taking_start? : Date

     /**
     * #Item Name: Taking Medicine end date 
     * #Use Explanation: Set Taking Medicine End Date for predetermined patient within the defined prescription period.
     * #Type: date(Localtime) (ISO8601 format)
     * #Indispensability: true
     */
    public taking_end?: Date    
}