import { SortItem, SortDirection } from '../mc-ui.models';
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
  const copy = Object.assign({}, target);
  Object.keys(source).forEach(key => {
    copy[key] = source[key];
  });
  return copy;
}

export function isEqualState(a: any, b: any) {
  // compare 1 level only
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  // assumption: the property value is object, the property order is equal
  if (aKeys.find(key => JSON.stringify(a[key]) !== JSON.stringify(b[key]))) {
    return false;
  }
  return true;
}
