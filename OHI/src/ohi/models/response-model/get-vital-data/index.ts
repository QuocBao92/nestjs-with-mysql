import { Result } from '../base-model'
import { VitalInformationBlood } from './vital-information-blood'
import { VitalInformationWeight } from './vital-information-weight'
import { IsNotEmpty } from 'class-validator'
import BaseModel from 'src/model/base-model'
import { DateTime } from 'aws-sdk/clients/devicefarm'

export class GetVitalDataModel extends BaseModel {

    public result: Result

    /**
     * #Item Name: HeartAdvisorUserID
     */
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public ha_user_id: string

    /**
     * #Item Name: Vital information (blood pressure)
     * #British Name: vital_data_blood
     * #Use Explanation: Array of vital information on individual patient who sets it for "Blood pressure" acquisition data type 
     *                   It sets it to the reverse chronological order on the measurement day. 
     * #Type: array
     */

    // tslint:disable-next-line:variable-name
    public vital_data: VitalInformationBlood[] | VitalInformationWeight[]

    /**
     * #Item Name: HA server API request receipt date
     * #British Name: ha_request_at
     * #Use Explanation: API request receipt date of the HA server is set.
     * #Type: string - epoch timestamp
     */
    // tslint:disable-next-line:variable-name
    public ha_request_at: number;
}