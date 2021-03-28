/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

export class PointRankCalculate {
    /**
     * #British Name: checkRank
     * #Use Explanation: specify rank of each property.
     * #Type: Function
     * #Return Type: string
     * @param point number
     * @param setting any
     */
    public static checkRank(point: number, setting: any): number {
        // If point null return rank null
        if (point === null) {
            return null;
        }
        if (point >= setting.rankH) {
            // point >= point of setting hight then return rank H
            return ERank.High;
        }
        // point >= point of setting medium and point < point of setting midHigh then return rank M
        if (point >= setting.rankM && point < setting.rankH) {
            return ERank.Medium;
        }
        // point >= point of setting low and point < point of setting medium then return rank L
        if (point >= setting.rankL && point < setting.rankM) {
            return ERank.Low;
        }
    }

    /**
     * #British Name: getRanksHightbpMeas
     * #Use Explanation: specify round number convert type float number.
     * 【HighBP/MEAS. [%] (IM)】
     * #Formula : points = IM/10
     * #Type: Function
     * #Return Type: Number
     * @param excessRate number
     * @param setting any
     */
    public static getPointRankHightbpMeas(excessRate: number, setting: any): any {
        let point = 0;
        if (excessRate === null) {
            return null;
        }
        point = excessRate / 10;
        point = +point.toFixed(1);
        if (point < setting.rankL) {
            point = setting.rankL;
        }
        return (point >= 3.0) ? 2.9 : point;
    }

    /**
     * #British Name: getRankSBP
     * #Use Explanation: specify point Average systolic blood pressure of patient.
     * 【SBP [mm Hg]】
     * #Type: Function
     * #Return Type: Number
     * @param sbp number systolic blood pressure
     * @param sbpTh number threshold systolic blood pressure
     * @param sbpT number target systolic blood pressure
     * @param setting any
     */
    public static getPointRankSBP(sbp: number, sbpTh: number, sbpT: number, setting: any): any {
        let point = 0;
        if (sbp === null || sbpTh === null || sbpT === null) {
            return null;
        }
        if ((sbp >= 250 && sbpTh >= 250)) {
            return point = 2.9;
        }
        if (sbp >= sbpTh) {
            point = (sbp - sbpTh) / (250 - sbpTh) + 2;
        } else if (sbpT > sbp) {
            point = (sbp - 100) / (sbpT - 100);
        } else if ((sbpTh > sbp) && (sbp >= sbpT)) {
            point = (sbp - sbpT) / (sbpTh - sbpT) + 1;
        }
        point = +point.toFixed(1);
        if (point < +setting.rankL) {
            point = setting.rankL;
        }
        return (point >= 3.0) ? 2.9 : point;
    }

    /**
     * #British Name: getRanksDBP
     * #Use Explanation: specify point diastolic blood pressure of patient.
     * 【DBP [mm Hg]】
     * #Type: Function
     * #Return Type: Number
     * @param dbp number diatolic blood pressure
     * @param dbpTh number threshold diatolic blood pressure
     * @param dbpT number target diatolic blood pressure
     * @param setting number
     */
    public static getPointRankDBP(dbp: number, dbpTh: number, dbpT: number, setting: any): any {

        let point = 0;
        if (dbp === null || dbpTh === null || dbpT === null) {
            return null;
        }
        if ((dbp >= 200 && dbpTh >= 200)) {
            return point = 2.9;
        }
        if (dbp >= dbpTh) {
            point = (dbp - dbpTh) / (200 - dbpTh) + 2;
        } else if ((dbpTh > dbp) && (dbp >= dbpT)) {
            point = (dbp - dbpT) / (dbpTh - dbpT) + 1;
        } else if (dbpT > dbp) {
            point = (dbp - 50) / (dbpT - 50);
        }
        point = +point.toFixed(1);
        if (point < setting.rankL) {
            point = setting.rankL;
        }
        return (point >= 3.0) ? 2.9 : point;
    }

    /**
     * #British Name: getRankPulse
     * #Use Explanation: specify point IHB of patient.
     * IHB [%]
     * #Type: Function
     * #Return Type: Number
     * @param pulse number
     * @param setting any
     */
    public static getPointRankPulse(pulse: number, setting: any): any {
        let point = 0;
        if (pulse === null) {
            return null;
        } else if (pulse >= 90) {
            point = (pulse - 90) / 10;
        } else if (60 > pulse) {
            point = (60 - pulse) / 10;
        }
        point = +point.toFixed(1);
        if (point < setting.rankL) {
            point = setting.rankL;
        }
        return (point >= 3.0) ? 2.9 : point;
    }

    /**
     * #British Name: getRankIHB
     * #Use Explanation: specify point and rank IHB of patient.
     * IHB [%]
     * #Type: Function
     * #Return Type: Number
     * @param ihb number
     * @param setting any
     */
    public static getPointRankIHB(ihb: number, setting: any): any {
        let point = 0;
        if (ihb === null) {
            return null;
        }
        point = ihb / 10;
        point = +point.toFixed(1);
        if (point < setting.rankL) {
            point = setting.rankL;
        }
        return (point >= 3.0) ? 2.9 : point;
    }

    /**
     * #British Name: getRankSideEffects
     * #Use Explanation: specify point side effects of patient.
     * 【SIDE EFFECTS [%] SIE】
     * #Type: Function
     * #Return Type: Number
     * @param sideEffect number (side effect generation days ÷ lapsed days) ×100)
     * @param setting any (rank default from table setting)
     */
    public static getPointRankSideEffects(sideEffect: number, setting: any): any {
        if (sideEffect === null) {
            return null;
        }
        let point = 0;
        point = sideEffect / 10;
        point = +point.toFixed(1);
        if (point < setting.rankL) {
            point = setting.rankL;
        }
        return (point >= 3.0) ? 2.9 : point;
    }

    /**
     * Specify total rank of patient.
     * @param rankSys number rank of systolic blood pressure
     * @param rankDia number rank of diastolic blood pressure
     */
    public static getRankTotal(rankSys: number, rankDia: number): number {
        if (rankSys === null && rankDia === null) {
            return null;
        }
        const ranks = [rankSys, rankDia];
        return Math.max(...ranks);
    }
}

export enum ERank {
    High = 4,
    Medium = 2,
    Low = 1,
}
