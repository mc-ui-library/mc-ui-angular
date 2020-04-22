import {
  SortItem,
  SortDirection,
  Column,
  VisualizerData,
  Filter,
  DataType
} from '../shared.models';
import { isEmpty } from './utils';
import * as papa from 'papaparse';

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

export function convertCsvToJson(text: string) {
  const result = papa.parse(text, { header: true });
  if (result.error) {
    console.warn('CSV parsing Error: ' + result.error);
  }
  return result.data;
}

export function convertKeysToColumns(obj: any): Array<Column> {
  return Object.keys(obj).reduce((columns: Array<Column>, key) => {
    columns.push({ field: key, name: key });
    return columns;
  }, []);
}

export function convertCsvToVisualizerData(
  text: string,
  filters: Array<Filter> = null
): VisualizerData {
  let data: Array<any> = convertCsvToJson(text);
  const columns = convertKeysToColumns(data[0] || {});
  if (filters) {
    data = data.filter((item: any) =>
      filters.some(filter => {
        const value = item[filter.field];
        const keyword = filter.keyword;
        switch (filter.type) {
          case DataType.DATE:
          case DataType.NUMBER:
            // TODO: compare conditions
            return value === keyword;
          default:
            // string
            return (value + '').toLowerCase().includes(keyword.toLowerCase());
        }
      })
    );
  }
  return {
    columns,
    data
  };
}

export function clone(o: any) {
  if (
    !o ||
    typeof o !== 'object' ||
    (o instanceof Date && !isNaN(o.valueOf()))
  ) {
    return o;
  } else if (Array.isArray(o)) {
    return o.map(item => clone(item));
  } else {
    return Object.keys(o).reduce((obj, key) => {
      obj[key] = clone(o[key]);
      return obj;
    }, {});
  }
}
