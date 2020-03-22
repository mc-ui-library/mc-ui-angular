import { formatNumber } from '@angular/common';

export function getLocale() {
  return window.navigator.language;
}

export function pwcFormatNumber(num: any, locale = getLocale(), format = '1.0-0') {
  return formatNumber(num, locale, format);
}
