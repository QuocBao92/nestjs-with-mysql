import * as moment from 'moment'; 

export interface ITimeUtil {
  utcNow(toDay?: boolean): string
  now(): string
  increase(by: number, from: string): string
  addDays(to: string, days: number): string
  isOver(time: string): boolean
  diffByMinutes(fromDate: string, toDate: string): number
  reformat(date: string, inputFormat: string, outputFormat: string): string
  setIds<T extends { id: string }>(baseId: string, items: T[]): string
}

export default class TimeUtil implements ITimeUtil {
  public static ID_FORMAT: string = 'YYMMDDHHmmssSS';
  public static DATE_FORMAT: string = 'YYYY-MM-DD';

  public utcNow(toDay: boolean = false): string {
    const utc = moment.utc();
    return toDay ? utc.format(TimeUtil.DATE_FORMAT) : utc.format();
  }

  public now(): string {
    return moment().format(TimeUtil.ID_FORMAT);
  }

  public increase(by: number, from: string): string {
    return moment(from, TimeUtil.ID_FORMAT)
      .add(by * 10, 'millisecond')
      .format(TimeUtil.ID_FORMAT);
  }

  public addDays(to: string, days: number): string {
    return moment(to, TimeUtil.ID_FORMAT)
      .add(days, 'days')
      .format(TimeUtil.ID_FORMAT);
  }
 
  public isOver(time: string): boolean {
    return moment().isAfter(moment(time, TimeUtil.ID_FORMAT));
  }

  public reformat(
    date: string,
    inputFormat: string,
    outputFormat: string
  ): string {
    return moment(date, inputFormat).format(outputFormat);
  }

  public diffByMinutes(fromDate: string, toDate: string): number {
    const from = moment(fromDate.substring(0, 10), TimeUtil.ID_FORMAT);
    const to = moment(toDate.substring(0, 10), TimeUtil.ID_FORMAT);
    return to.diff(from, 'minutes', true);
  }

  public setIds<T extends { id: string }>(baseId: string, items: T[]): string {
    items.forEach((t, idx) => {
      t.id = this.increase(idx + 1, baseId);
    });
    return this.increase(items.length, baseId);
  }
}
