import { BaseDataItemModel } from '../base-model'
import { IsNotEmpty, Min, Max, Length } from 'class-validator'

export class VitalInformationBlood extends BaseDataItemModel {

    /**
     * #Item name: Measurement date
     * #Indispensability:  true 
     * #Type: string - epoch timestamp
     * #Use explanation: The measurement date is set. 
     */
    @IsNotEmpty()
    public date: number

    /**
     * #Item name: Measurement time of date zone
     * #Indispensability: true 
     * #Type: string
     * #Use explanation: The time zone of the measurement date is set. 
     */
    @IsNotEmpty()
    public timezone: string

    /**
     * #Item name: Maximal pressure
     * #Indispensability: true
     *  #Type: integer
     * #Use explanation: The maximal pressure is set. (required item when hand is input)
     */
    @IsNotEmpty()
    public sys: number

    /**
     * #Item name: Minimal pressure
     * #Indispensability: true
     * #Type: integer
     * #Use explanation: The minimal pressure is set. (required item when hand is input)
     */
    @IsNotEmpty()
    public dia: number

    /**
     * #Item name: Pulse
     * #Indispensability: true
     * #Type: integer
     * #Use explanation:The pulse is set. (required item when hand is input)
     */
    @IsNotEmpty()
    public pulse: number

    /**
     * #Item name: Arrhythmia existence
     * #Type: integer
     * #Number of characters: 0-1
     * #Use explanation: The presence of arrhythmia is set. Nothing ..arrhythmia..: 0 and arrhythmia having: 1
     */
    @Length(0,1)
    public ihb: number

    /**
     * #Item name: State of [kafu] rolling
     * #Type: integer
     * #Number of characters: 0-1
     * #Use explanation: The [kafu] rolling is set. 0:It is abnormally, and is 1: Abnormally none. 
     */
    @IsNotEmpty()
    public cuff: number

    /**
     * #Item name: Body motion existence
     * #Type: integer
     * #Number of characters: 0-1
     * #Use explanation: The presence of the body motion is set. Nothing ..body motion..: 0 and body motion having: 1
     */
    @IsNotEmpty()
    @Length(0,1)
    // tslint:disable-next-line:variable-name
    public body_movement: number
    
    /**
     * #Item name: Automatic operation/person input flag
     * #Type: integer
     * #Number of characters: 0-1
     * #Use explanation: The vital input method is set. 1:Automatic operation and 2: Manual input. 3: Office input.
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public input_type: number

    /**
     * #Item name: Delete flag
     * #Type: integer
     * #Use explanation: Set whether data has been deleted. Not deleted: 0, Deleted: 1
     */
    @IsNotEmpty()
    @Length(0,1)
    public delete: number;
}