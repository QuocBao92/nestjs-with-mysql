import { HeartAdvisorUserID } from './heart-advisor-user-id'
import BaseModel from '../../../../model/base-model'
import { Result } from '../../../../model/base-result.model'

export class GetHeartAdvisorUserIdModel extends BaseModel{
    /**
     * #Item Name: Result
     * #British Name: result
     * #Type: object
     * #Indispensability: true
     */
    public result: Result

    /**
     * #Item Name: Data
     * #British Name: data
     * #Use Explanation: Array of HeartAdvisorUserID
     * #Type: array
     * #Indispensability: true
     */
    public data: HeartAdvisorUserID[]
}
