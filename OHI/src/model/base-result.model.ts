import { IsNotEmpty } from 'class-validator';
import BaseModel from './base-model';

export class Result extends BaseModel {
    /**
     * #Item Name: Error code
     * #Use explanation:  Normally: 0. At the error: Please set it on the OHI server side.
     * #Indispensability: true
     * #Number of characters: 0-999
     */
    @IsNotEmpty()
    public code: string;

    /**
     * #Item Name: Error message
     * #Use explanation: Normally: The item none. In case of normally: Please set it on the OHI server side.
     * #Number of characters: Irregularity
     */
    public message: string;
}
