import { BaseDataItemModel } from '../base-model';

export class IndividualPatientsInformation extends BaseDataItemModel {
    
    /**
     * #Item Name: Visit date
     * #British Name: date
     * #Use Explanation: The day of going to hospital regularly is set. 
     * #Type: Date - date(Localtime) (ISO8601 format)
     * #Indispensability: true
     */
    public date: Date
}