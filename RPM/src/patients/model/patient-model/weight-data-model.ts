export class WeightData {
    // tslint:disable-next-line:variable-name
    last_update?: string;

    /**
     *  Weight threshold exceeded alert: Weight before change (kg)
     */
    // tslint:disable-next-line:variable-name
    before_weight_kg?: number;

    /**
     *  Weight threshold exceeded alert: Weight before change (lbs)
     */
    // tslint:disable-next-line:variable-name
    before_weight_lbs?: number;

    /**
     * Weight threshold exceeded alert: Date before change
     */
    // tslint:disable-next-line:variable-name
    before_day?: string;

    /**
     * Weight threshold exceeded alert: Weight after change (kg)
     */
    // tslint:disable-next-line:variable-name
    after_weight_kg: number;

    /**
     * Weight threshold exceeded alert: Weight after change (lbs)
     */
    // tslint:disable-next-line:variable-name
    after_weight_lbs: number;

    /**
     * Date after change
     */
    // tslint:disable-next-line:variable-name
    after_day: number;

    /**
     *  Weight Threshold Exceeded Alert: Threshold setting (kg)
     */
    // tslint:disable-next-line:variable-name
    threshold_kg: number;

    /**
     *  Weight Threshold Exceeded Alert: Threshold setting (lbs)
     */
    // tslint:disable-next-line:variable-name
    threshold_lbs: number;

    /**
     * Weight Threshold Exceeded Alert: Threshold setting: Duration
     */
    // tslint:disable-next-line:variable-name
    threshold_period: number;

    /**
     * hidden key for sort
     */
    // tslint:disable-next-line:variable-name
    sort_second_key_lbs: number;

}
