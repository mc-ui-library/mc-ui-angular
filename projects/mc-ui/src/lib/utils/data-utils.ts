import { SortItem, SortDirection } from '../shared.models';
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

export function setStateIf(target: any, source: any) {
  // if source has target keys, then apply them to target
  source = Object.assign({}, source);
  return Object.keys(target).reduce((t, key) => {
    if (!isEmpty(source[key])) {
      t[key] = source[key];
    } else {
      t[key] = target[key];
    }
    return t;
  }, {});
}

export function setState(target: any, source: any) {
  // copy source to target
  source = Object.assign({}, source);
  Object.keys(source).forEach(key => {
    target[key] = source[key];
  });
  return target;
}
