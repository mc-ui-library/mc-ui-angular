import { formatDate } from '@angular/common';

export function simpleFormatDate(date: string | number | Date, format = 'yyyy/MM/dd', locale = 'en-US') {
  return formatDate(date, format, locale);
}
