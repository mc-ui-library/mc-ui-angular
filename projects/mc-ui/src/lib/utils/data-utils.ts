import { SortItem, SortDirection } from './../models';
import { isEmpty } from './utils';

export function sortObjectArray(data: any[], sort: SortItem) {
  data = data.concat();
  data.sort((a, b) => {
    let valA = a[sort.fieldName];
    let valB = b[sort.fieldName];
    if (sort.direction === SortDirection.DESC) {
      [valA, valB] = [valB, valA];
    }
    return typeof valA === 'string' ? valA.localeCompare(valB) : valA - valB;
  });
  return data;
}

export function applyIf(target: any, source: any) {
  const targetFromSource = Object.keys(target).reduce((t, key) => {
    if (!isEmpty(source[key])) {
      t[key] = source[key];
    }
    return t;
  }, {});
  return Object.assign(targetFromSource, target);
}
