import { BaseDataItemModel } from '../base-model'
import { IsNotEmpty } from 'class-validator'

export class InformationOnSideEffect extends BaseDataItemModel {

    /**
     * #Item name: Side effect generation day
     * #Type: date(Localtime) (ISO8601 format)
     * #Use explanation: The side effect sets the day that generates. 
     * #Indispensability: true
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public take_date: Date

    /**
     * #Item name: Side effect
     * #Type: string
     * #Use explanation: 1: palpitation. 2: dizziness. 3: headache. 4: hot flashes. 5: swelling. 6: cough
     */
    // tslint:disable-next-line:variable-name
    public side_effects: string;
    
}