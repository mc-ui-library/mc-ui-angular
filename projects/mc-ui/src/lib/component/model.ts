export interface Column {
  field?: string; // field name;
  name?: string; // column name
  width?: number;
}

export interface ScrollData {
  headerData?: any[];
  columns?: Column[];
  action?: 'append' | 'insert' | 'initialize';
  rows: any[];
  start?: number;
  rowCount?: number;
}

export interface Box {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}

/**
 * Basic Data Structure. label for group label like "January", series: Product Name etc.
 * Provides Pivot, Sort, Lots Views. Pivot will change the label <-> series
 * data: [
 *  { label: xx, values: [ { series: x, value: x, detail: {...} },... ]},
 *  { label: xx2, values: [...]},
 *  ...
 * ]
 */

export interface ChartItemData {
  series: string;
  value: any;
  detail?: any;
}
export interface ChartData {
  label: string;
  values: ChartItemData[];
}

export interface ChartConfig {
  type?: string;
  subType?: string;
  labels?: string[];
  series?: string[];
  data: ChartData[];
}

export interface BarChartConfig extends ChartConfig {
  type?: 'bar';
  subType?: BarTypes;
  rectWidth?: number;
  zeroLikeValue?: number;
  autoWidth?: boolean;
  minRatio?: number;
  maxRatio?: number;
  maxValue?: number;
  minValue?: number;
  hasAxisX?: boolean;
  hasAxisY?: boolean;
  hasGridX?: boolean;
  hasGridY?: boolean;
}

export interface BarDomain {
  min: number;
  max: number;
  min1: number;
  max1: number;
  hasNegative: boolean;
}


// ************* enums **************
export enum BarTypes {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  STACKED = 'stacked'
}
