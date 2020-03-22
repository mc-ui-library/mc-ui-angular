import * as moment from 'moment';

export function pwcFormatDate(date: any, format = 'YYYY-MM-DD') {
  return moment
    .unix(date)
    .utc()
    .format(format);
}
