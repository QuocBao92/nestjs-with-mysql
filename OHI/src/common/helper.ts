
//tslint:disable
export class Helper {
  
  public static replaceVietnameSymbol(str: string): string {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
      .replace(/ì|í|ị|ỉ|ĩ/g, "i")
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
      .replace(/đ/g, "d")
      .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
      .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
      .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
      .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
      .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
      .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
      .replace(/Đ/g, "D");
    return str;
  }

  /**
   * 
   * @param storeName 
   */
  public static makeUrl(storeName: string): string {
    if (typeof storeName === "undefined" || storeName === null || storeName.trim() === "") {
      return "";
    }
    var url = this.replaceVietnameSymbol(storeName);
    url = url.toLowerCase().trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/&/g, '-and-')         // Replace & with 'and'
      .replace(/[^a-zA-Z0-9_\u3400-\u9FBF\s-]/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-')        // Replace multiple - with single -
      .replace(/^-+|-+$/g, '') // remove leading, trailing -
    return url;
  }

  public static setParamsUri(query: object) {
    let paramsUri = ''
    const keys = Object.keys(query);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      paramsUri += paramsUri !== '' ? `&${key}=${query[key]}` : `?${key}=${query[key]}`;
    }
    return paramsUri;
  }

  /**
 * @param vitalData Data to API OHI getVitalData
 * #British Name: getCalsDuration 
 * #Use Explanation: Specified count duration on the patient
 * #Type: Function
 */
  public static getCalsDuration(visitData: any): number {
    const data = visitData.filter(item => item !== null)
    return data.length;
  }

  /**
  * @param sideEffectsInfo Data to API OHI getSideEffects
  * #British Name: getSideEffects 
  * #Use Explanation: Specified side effects on the patient [%]
  * #Type: Function
  */
  public static getSideEffects(sideEffectsInfo: any): number {
    const countDateSe = sideEffectsInfo.length;
    let countSe = 0;
    for (var i = 0; i < sideEffectsInfo.length; i++) {
      if (sideEffectsInfo[i].side_effects.search('1') >= 0) {
        countSe++;
      }
    }
    return Math.round((countSe / countDateSe) * 100)
  }

  public static getDaySideEffects(sideEffectsInfo: any): number {
    const countDateSe = sideEffectsInfo.filter(item => item !== null);
    return countDateSe.length;
  }
 
  /**
   * @param vitalData Data to API OHI getVitalData
   * #British Name: getCountExceedsThresholdBP 
   * #Use Explanation: specify count exceeds threshold blood pressure (higthbp / meas ).
   * #Type: Function
   */
  public static getCountExceedsThresholdBP(vitalData: any): any {
    const measData = vitalData.filter(item => {
      return item.sys_avg_day !== null || item.dia_avg_day !== null
    });
    let countEThreshol = 0;
    for (let i = 0; i < vitalData.length; i++) {
      if (vitalData[i].sys_avg_day >= 180 && vitalData[i].dia_avg_day >= 110) {
        countEThreshol++;
      }
    }
    return { higthbp: countEThreshol, meas: measData.length }
  }

  public static getLastMeasDate(vitalData:any) :string{
      return vitalData.vital_data_blood[0].data ? vitalData.vital_data_blood[0].data: '' ;
  }

  public static getRoundIhbRate(ihb) :number{
    return Math.round(ihb);
}

  /**
  * sort measurement_day
  * @param a -time one
  * @param b -time tow
  */
  public static sortDayTime(a: any, b: any) {
    const byDateOne = new Date(a.measurement_day).getTime();
    const byDateTow = new Date(b.measurement_day).getTime();
    return byDateOne < byDateTow ? 1 : -1;
  }

  /**
   * #conver kg to lbs
   * @param arr: api getLatestWeightInfo
   */
  public static convertKgToLbs(arr: any) {
    // 1 kg = 2,20462262 pound
    const kg = 2.2046;
    let weightLbs = 0;
    let latestWeight: boolean = false;
    for (var i = 0; i < arr.daily_average.length; i++) {
      if (Number(i) === 0) {
        arr['latest_weight'] = Math.round(arr.daily_average[i].weight_kg * kg);
        latestWeight = true;
        // break;
      }
      weightLbs = arr.daily_average[i].weight_kg * kg;
      arr.daily_average[i]['weight_lbs'] = Math.round(weightLbs);
    }
  }

  /**
   * #Get blood pressure latest.
   * @param arr : api getVitalAverageData.
   * @param type: Blood Pressure.
   */
  public static calculationBpLatest(arr: any, type: any) {
    var value = 0;
    for (var i = 0; i <= arr.length; i++) {
      switch (type) {
        case 'sys_avg_morning':
          if (i == 0) {
            value = arr[i].sys_avg_morning;
          }
          break;
        case 'sys_avg_evening':
          if (i == 0) {
            value = arr[i].sys_avg_evening;
          }
          break;
        case 'dia_avg_morning':
          if (i == 0) {
            value = arr[i].dia_avg_morning;
          }
          break;
        case 'dia_avg_evening':
          if (i == 0) {
            value = arr[i].dia_avg_evening;
          }
          break;
      }
      return value;
    }
  }
}


