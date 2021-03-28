/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HeartAdvisorUserID } from './heart-advisor-user-id';
import { Result, BaseModel } from '../../../../models';

export class GetHeartAdvisorUserIdModel extends BaseModel {
    /**
     * #Item Name: Result
     * #British Name: result
     * #Type: object
     * #Indispensability: true
     */
    public result: Result;

    /**
     * #Item Name: Data
     * #British Name: data
     * #Use Explanation: Array of HeartAdvisorUserID
     * #Type: Array[object]
     * #Indispensability: true
     */
    public data: HeartAdvisorUserID[];
}
