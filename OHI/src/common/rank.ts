
// tslint:disable-next-line:variable-name

class Rank {

    /**
     * #British Name: truncate 
     * #Use Explanation: truncate type float number   .
     * #Type: Function
     * #Return Type: Number
     */
    public static truncate(num: number, places: number): number {
        return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
    }

    /**
     * #British Name: roundFloatNumbert 
     * #Use Explanation: specify round number convert type float number .
     * #Type: Function
     * #Return Type: Number
     */
    public static roundFloatNumber(num: number): number {
        return this.truncate(num, 1);
    }

    /**
     * #British Name: checkRank 
     * #Use Explanation: specify rank of each property .
     * #Type: Function
     * #Return Type: string
     */
    public static checkRank(point: number): number {
        if (point >= 3 && point <= 3.9) {
            return ERank.High
        }
        if (point >= 2 && point <= 2.9) {
            return ERank.MidHigh
        }
        if (point >= 1 && point <= 1.9) {
            return ERank.Medium
        }
        if (point >= 0 && point <= 0.9) {
            return ERank.Low
        }
        return null;
    }

    /**
     * #British Name: getRanksHightbpMeas 
     * #Use Explanation: specify round number convert type float number.
     * 【HighBP/MEAS. [%] (IM)】
     * #Formula : points = IM-/10  
     * #Type: Function
     * #Return Type: Number
     */
    public static getRanksHightbpMeas(hightBP: number, meas: number): number {
        const points = ((hightBP / meas) * 100) / 10;
        const result = (points) >= 4.0 ? 3.9 : this.roundFloatNumber(points) < 0 ? 0 : this.roundFloatNumber(points);
        return this.checkRank(result);
    }

    /**
     * #British Name: getRankSBP 
     * #Use Explanation: specify point Average systolic blood pressure of patient.
     * 【SBP [mm Hg]】 
     * #Type: Function
     * #Return Type: Number
     */
    public static getRankSBP(sbp: number): number {
        let points = null;
        if (sbp >= 140) {
            points = (sbp - 140) / 20 + 2;
        }
        if (sbp >= 120 && sbp < 140) {
            points = (sbp - 120) / 10;
        }
        if (sbp < 120) {
            points = (120 - sbp) / 10;
        }
        const result = this.roundFloatNumber(points) >= 4.0 ? 3.9 : this.roundFloatNumber(points) < 0 ? 0 : this.roundFloatNumber(points);
        return this.checkRank(result);
    }

    /**
     * #British Name: getRanksDBP 
     * #Use Explanation: specify point diastolic blood pressure of patient.
     * 【DBP [mm Hg]】
     * #Type: Function
     * #Return Type: Number
     */
    public static getRankDBP(dbp: number): number {
        let points = null;
        points = (dbp - 70) / 10;
        const result = this.roundFloatNumber(points) >= 4.0 ? 3.9 : this.roundFloatNumber(points) < 0 ? 0 : this.roundFloatNumber(points);
        return this.checkRank(result);
    }

    /**
     * #British Name: getRankPulse 
     * #Use Explanation: specify point IHB of patient.
     * IHB [%]
     * #Type: Function
     * #Return Type: Number
     */
    public static getRankPulse(pulse: number): number {
        let points = null;
        if (pulse >= 80) {
            points = (pulse - 80) / 10;
        }
        if (pulse < 80 && pulse >= 70) {
            points = 0;
        }
        if (pulse < 70) {
            points = (70 - pulse) / 10;
        }
        const result = this.roundFloatNumber(points) >= 4.0 ? 3.9 : this.roundFloatNumber(points) < 0 ? 0 : this.roundFloatNumber(points);
        return this.checkRank(result);
    }
    /**
     * #British Name: getRankPressure 
     * #Use Explanation: Specify rank pressure of patient.
     * #Type: Function
     * #Return Type: Number
     */
    public static getRankPressure(sbp: number, dbp: number): number {
        const rankSbp = this.getRankSBP(sbp);
        const rankdbp = this.getRankDBP(dbp);
        const rankPressure = rankSbp >= rankdbp ? rankdbp : rankSbp;
        return rankPressure;

    }

    /**
     * #British Name: getRankIHB 
     * #Use Explanation: specify point IHB of patient.
     * IHB [%] 
     * #Type: Function
     * #Return Type: Number
     */
    public static getRankIHB(ihb: number): number {
        const points = ihb / 10;
        const result = this.roundFloatNumber(points) >= 4.0 ? 3.9 : this.roundFloatNumber(points) < 0 ? 0 : this.roundFloatNumber(points);
        return this.checkRank(result);
    }

    /**
     * #British Name: getRankSideEffects 
     * #Use Explanation: specify point side effects of patient.
     * 【SIDE EFFECTS [%] SIE】
     * #Type: Function
     * #Return Type: Number
     */
    public static getRankSideEffects(sie: number): number {
        const points = sie / 10;
        const result = this.roundFloatNumber(points) >= 4.0 ? 3.9 : this.roundFloatNumber(points) < 0 ? 0 : this.roundFloatNumber(points);
        return this.checkRank(result);
    }

    /**
     * #British Name: checkPoint 
     * #Use Explanation: check item each points (Hight/Mid-Hight/Medium/Low).
     * #Type: Function
     * #Return Type: object
     */
    public static checkPoint(item: number, nameItem: string): any {
        // tslint:disable-next-line:one-variable-per-declaration
        let h, mh, m, l;
        const size = config.medical[nameItem].length;

        switch (size) {
            case 2:
                h = item >= config.medical[nameItem][0].data.hight.min || item <= config.medical[nameItem][1].data.hight.max;
                mh = (item >= config.medical[nameItem][0].data.mid_hight.min && item <= config.medical[nameItem][0].data.mid_hight.max) ||
                    (item >= config.medical[nameItem][1].data.mid_hight.min && item <= config.medical[nameItem][1].data.mid_hight.max);
                m = (item >= config.medical[nameItem][0].data.medium.min && item <= config.medical[nameItem][0].data.medium.max) ||
                    item >= config.medical[nameItem][1].data.medium.min && item <= config.medical[nameItem][1].data.medium.max;
                l = (item >= config.medical[nameItem][0].data.low.min && item <= config.medical[nameItem][0].data.low.max) ||
                    (item >= config.medical[nameItem][1].data.low.min && item <= config.medical[nameItem][1].data.low.max);

                return { h, mh, m, l }
            case 1:
                h = item >= config.medical[nameItem][0].data.hight.min;
                mh = item >= config.medical[nameItem][0].data.mid_hight.min && item <= config.medical[nameItem][0].data.mid_hight.max;
                m = item >= config.medical[nameItem][0].data.medium.min && item <= config.medical[nameItem][0].data.medium.max;
                l = item >= config.medical[nameItem][0].data.low.min && item <= config.medical[nameItem][0].data.low.max;
                if (nameItem === NameProperty.DBP) {
                    l = (item >= config.medical[nameItem][0].data.low.min && item <= config.medical[nameItem][0].data.low.max) ||
                        (item < config.medical[nameItem][0].data.low.min);
                }
                return { h, mh, m, l }

            default:
                break;
        }
        return null;
    }

    /**
     * #British Name: getRankPatient 
     * #Use Explanation: get rank type medical of patient (1:H/2:MH/3:M/4:L).
     * #Type: Function
     * #Return Type: number
     */
    public static getRankPatient(hightbpmeas: number, sbp: number, dbp: number, pulse: number, ihb: number, sie: number): number {
        const hightbpItem = this.checkPoint(hightbpmeas, NameProperty.HightBPMeas);
        const sdbItem = this.checkPoint(sbp, NameProperty.SBP);
        const dbpItem = this.checkPoint(dbp, NameProperty.DBP);
        const pulseItem = this.checkPoint(pulse, NameProperty.PULSE);
        const ihbItem = this.checkPoint(ihb, NameProperty.IHB);
        const sieItem = this.checkPoint(sie, NameProperty.SideEffects);
        const summary = [hightbpItem, sdbItem, dbpItem, pulseItem, ihbItem, sieItem];

        // tslint:disable-next-line:one-variable-per-declaration
        let countH = 0, countMh = 0, countM = 0, countL = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < summary.length; i++) {
            if (summary[i].h) {
                countH++;
            }
            if (summary[i].mh) {
                countMh++;
            }

            if (summary[i].m) {
                countM++;
            }

            if (summary[i].l) {
                countL++;
            }
        }
        if (countH > 0) {
            return ERank.High;
        }
        if (countH === 0 && countMh > 0) {
            return ERank.MidHigh;
        }
        if (countH === 0 && countMh === 0 && countM > 0) {
            return ERank.Medium;
        }
        return ERank.Low;

    }
}

export enum NameProperty {
    HightBPMeas = 'highbp_meas',
    SBP = 'sbp',
    DBP = 'dbp',
    PULSE = 'pulse',
    IHB = 'ihb',
    SideEffects = 'side_effects',
}

export enum ERank {
    High = 1,
    MidHigh = 2,
    Medium = 3,
    Low = 4
}
const config = {
    'medical': {
        'name': 'medical',
        'highbp_meas': [{
            'name': NameProperty.HightBPMeas,
            'condition': '<=',
            'operator': '%',
            'data': {
                'hight': {
                    max: 39,
                    min: 30,
                    rank: 'H'
                },
                'mid_hight': {
                    max: 29,
                    min: 20,
                    rank: 'MH'
                },
                'medium': {
                    max: 19,
                    min: 10,
                    rank: 'M'
                },
                'low': {
                    max: 9,
                    min: 0,
                    rank: 'L'
                }

            }
        }],
        'sbp': [{
            'name': NameProperty.SBP,
            'condition': '<=',
            'operator': '%',
            'data': {
                'hight': {
                    'max': 178,
                    'min': 160

                },
                'mid_hight': {
                    'max': 159,
                    'min': 140
                },
                'medium': {
                    'max': 139,
                    'min': 130
                },
                'low': {
                    'max': 129,
                    'min': 120
                }

            }
        },
        {
            'name': NameProperty.SBP,
            'condition': '>=',
            'operator': null,
            'data': {
                'hight': {
                    'max': 90,
                    'min': 81
                },
                'mid_hight': {
                    'max': 110,
                    'min': 101
                },
                'medium': {
                    'max': 139,
                    'min': 130
                },
                'low': {
                    'max': 111,
                    'min': 120
                }
            }
        }],
        'dbp': [{
            'name': NameProperty.DBP,
            'condition': '<=',
            'operator': null,
            'data': {
                'hight': {
                    'max': 109,
                    'min': 100,
                },
                'mid_hight': {
                    'max': 99,
                    'min': 90
                },
                'medium': {
                    'max': 89,
                    'min': 80,
                },
                'low': {
                    'max': 79,
                    'min': 71,
                }
            }
        }],
        'pulse': [{
            'name': NameProperty.PULSE,
            'condition': '<=',
            'operator': null,
            'data': {
                'hight': {
                    max: 119,
                    min: 110,
                    rank: 'H'
                },
                'mid_hight': {
                    max: 109,
                    min: 100,
                    rank: 'MH'
                },
                'medium': {
                    max: 99,
                    min: 90,
                    rank: 'M'
                },
                'low': {
                    max: 89,
                    min: 80,
                    rank: 'L'
                },
            }
        }, {
            'name': NameProperty.PULSE,
            'condition': '<=',
            'operator': null,
            'data': {

                'hight': {
                    max: 31,
                    min: 40,
                    rank: 'H'
                },
                'mid_hight': {
                    max: 41,
                    min: 50,
                    rank: 'MH'
                },
                'medium': {
                    max: 51,
                    min: 60,
                    rank: 'M'
                },
                'low': {
                    max: 61,
                    min: 70,
                    rank: 'L'
                }

            }
        }],
        'ihb': [{
            'name': NameProperty.IHB,
            'condition': '<=',
            'operator': '%',
            'data': {
                'hight': {
                    'max': 39,
                    'min': 30
                },
                'mid_hight': {
                    'max': 29,
                    'min': 20
                },
                'medium': {
                    'max': 19,
                    'min': 10
                },
                'low': {
                    'max': 9,
                    'min': 0
                }
            }
        }],
        'side_effects': [{
            'name': NameProperty.SideEffects,
            'condition': '<=',
            'operator': '%',
            'data': {
                'hight': {
                    'max': 39,
                    'min': 30
                },
                'mid_hight': {
                    'max': 29,
                    'min': 20
                },
                'medium': {
                    'max': 19,
                    'min': 10
                },
                'low': {
                    'max': 9,
                    'min': 0
                }
            }
        }]
    },
    'point_color': {
        'hight': '#ffd3d2',
        'mid_hight': '#ffd6a1',
        'medium': '#fff4b8',
        'low': ''
    },
    'rank_color': {
        'hight': '#dd0c0c',
        'mid_hight': '#dd460c',
        'medium': '#fff4b8',
        'low': '#30d312'
    }

}


export default Rank;



