/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

import { isNullOrUndefined } from 'util';
import * as CRYPTO from 'crypto';
import { ContractWeight } from '.';

export class Helper {

  /**
   * Check isValid date format YYYY-MM-dd.
   * @param dateString
   */
  public static isValidFormatDate(dateString: any) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    return dateString.toString().match(regEx) != null;
  }

  /**
   * Calculator average blood pressure.
   * @param vitalData : array of vital data to calculated
   * @param type : sys_avg_day, dia_avg_day, pulse_avg_day
   * @param numberDate default 7 days
   */
  public static average(vitalData: any, type: string, numberDate: number = 7): number | undefined {
    if (!vitalData) {
      return null;
    }
    const arrType = vitalData?.map(a => a[type])?.filter(a => !isNullOrUndefined(a));
    if (!arrType || arrType.length <= 1) {
      return null;
    }
    if (arrType.length > numberDate) {
      arrType.splice(numberDate, arrType.length);
    }
    const avg = arrType.reduce((a, b) => (+a) + (+b), 0) / arrType.length;
    return Number((avg).toFixed(0));
  }

  /**
   * isAlphanumeric
   * @param param string
   */
  public static isAlphanumeric(param: string) {
    const regEx = /^[a-zA-Z0-9]*$/;
    return param.match(regEx) != null;
  }

  /**
   * Generate random string with size
   * @param size number
   */
  public static randomString(size: number) {
    return CRYPTO.randomBytes(size).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, size);
  }

  /**
   * Function convert weight value in string format to float
   * @param latestWeight Value in string format
   * @param contractStatus Contract_weight in table d_patient_contract
   */
  public static convertLatestWeight(latestWeight: string, contractStatus: number) {
    if (contractStatus === ContractWeight.No) {
      // If [Presence/Absence of Body Composition Monitor] is 0, omit the item.
      return undefined;
    }

    if (contractStatus === ContractWeight.Yes) {
      // If [Presence/absence of body weight/body composition contract] is 1, obtain value from OHI "Weight information acquisition API"
      if (latestWeight) {
        return parseFloat(latestWeight);
      } else {
        // "Null" if value from OHI is not acquired
        return null;
      }
    }
  }

  /**
   * Function convert weight threshold alert from OHI to weight alert value
   * @param weightThresholdAlert Set the weight alert judgment status:
   * 0: None
   * 1: Alert with weight threshold of low priority
   * 2: Alert with weight threshold of "High" priority
   * @param contractStatus Contract_weight in table d_patient_contract
   */
  public static convertWeightAlert(weightThresholdAlert: number, contractStatus: number) {
    if (contractStatus === ContractWeight.No) {
      // If [Presence/Absence of Body Composition Monitor] is 0, return 0.
      return 0;
    }

    let weightAlert: number;

    if (contractStatus === ContractWeight.Yes) {
      // If [Presence/absence of body weight/body composition contract] is 1, return 0 if value obtain from OHI is 0, other value will return 1
      weightAlert = weightThresholdAlert === 0 ? 0 : 1;
    }

    return weightAlert;
  }

  /**
   * Function convert datetime obtain from OHI to RPM
   * @param datetimeInMilli Value in millisecond
   * @param contractStatus Contract_weight in table d_patient_contract
   */
  public static convertDateTimeOfChange(datetimeInMilli: number, contractStatus: number) {
    if (contractStatus === ContractWeight.No) {
      // If [Presence/Absence of Body Composition Monitor] is 0, omit the item.
      return undefined;
    }

    let result: number;

    if (contractStatus === ContractWeight.Yes) {
      // If [Presence/absence of body weight/body composition contract] is 1, return value obtain from OHI, if can't acquired value then return null
      result = datetimeInMilli ? datetimeInMilli : null;
    }

    return result;
  }

  /**
   * Function get and convert threshold settings from OHI
   * @param ohiThresholdKg threshold_kg from OHI
   * @param ohiThresholdLbs threshold_lbs from OHI
   * @param ohiThresholdPeriod threshold_period from OHI
   * @param contractStatus Contract_weight in table d_patient_contract
   */
  public static convertThresholdSettings(ohiThresholdKg: string, ohiThresholdLbs: string, ohiThresholdPeriod: number, contractStatus: number) {
    const resultObj = {
      threshold_kg: undefined,
      threshold_lbs: undefined,
      threshold_period: undefined,
    };
    if (contractStatus === ContractWeight.No) {
      // If [Presence/Absence of Body Composition Monitor] is 0, return object with undefined fields.
      return resultObj;
    }

    if (contractStatus === ContractWeight.Yes) {
      // If [Presence/absence of body weight/body composition contract] is 1
      if (ohiThresholdKg && ohiThresholdLbs && ohiThresholdPeriod) {
        // If can get all 3 threshold values then assign it into result object
        resultObj.threshold_kg = parseFloat(ohiThresholdKg);
        resultObj.threshold_lbs = parseFloat(ohiThresholdLbs);
        resultObj.threshold_period = ohiThresholdPeriod;
      } else {
        // If any threshold setting can't acquired, assign null value to result object
        resultObj.threshold_kg = null;
        resultObj.threshold_lbs = null;
        resultObj.threshold_period = null;
      }
    }

    return resultObj;
  }
}
