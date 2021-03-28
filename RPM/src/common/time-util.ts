/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import * as moment from 'moment';
import { isNullOrUndefined } from 'util';

export default class TimeUtil {
  public static DATE_FORMAT: string = 'YYYY-MM-DD';
  public static DATE_TIME_FORMAT: string = 'YYYY-MM-DDTHH:mm:ss';

  /**
   * format
   * @param val Date string
   * @param isDateTime if true format DATE_TIME_FORMAT else format DATE_FORMAT
   * @param isGetTime if true getTime()
   */
  public static format(val: string | Date | number, timezone?: string, isDateTime?: boolean, isGetTime?: boolean) {
    if (isNullOrUndefined(val)) {
      return val;
    }
    let valFormat;
    if (timezone) {
      // tslint:disable-next-line:no-string-literal
      valFormat = moment(moment(val).utcOffset(timezone)).format(isDateTime ? TimeUtil.DATE_TIME_FORMAT : TimeUtil.DATE_FORMAT);
    } else {
      valFormat = moment(val).format(isDateTime ? TimeUtil.DATE_TIME_FORMAT : TimeUtil.DATE_FORMAT);
    }
    return isGetTime ? new Date(valFormat).getTime() : valFormat;
  }

  /**
   * isDateFuture
   * @param param any
   */
  public static isDateFuture(param: any) {
    // Create a current date
    const now = Date.now();
    // Get time date
    const toDay = new Date(param).getTime();
    if (toDay > now) {
      // If time of toDay > time of now return true
      return true;
    }
  }
}
