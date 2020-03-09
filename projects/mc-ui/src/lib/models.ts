// ************* common component enums **************

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC'
}

export enum ScrollDataAction {
  INIT = 'INIT',
  APPEND = 'APPEND',
  RELOAD = 'RELOAD',
  INSERT = 'INSERT',
  SORT = 'SORT'
}

export enum GridAction {
  SELECT_CELL = 'SELECT_CELL',
  SORT = 'SORT',
  MOUSEOVER_CELL = 'MOUSEOVER_CELL',
  UPDATE_WIDTH = 'UPDATE_WIDTH',
  LOADED = 'LOADED'
}

export enum ListAction {
  SELECTED_ITEM = 'SELECTED_ITEM',
  UNSELECTED_ITEM = 'UNSELECTED_ITEM',
}

export enum Location {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM'
}

export enum ChartTypes {
  VERTICAL_BAR = 'vertical-bar',
  LINE = 'line',
  BAR_LINE = 'bar-line'
}

export enum ChartScaleType {
  LINEAR = 'linear',
  BAND = 'band'
}

// ************* common component interface **************

export interface Message {
  from?: string;
  to: string;
  action: string;
  data?: any;
}

export interface SortItem {
  fieldName: string;
  direction: SortDirection;
}

export interface Message {
  from?: string;
  to: string;
  action: string;
  data?: any;
}
export interface Column {
  field?: string; // field name;
  name?: string; // column name
  width?: number;
  sort?: boolean;
  sortDirection?: SortDirection;
  fixedWidth?: boolean;
  class?: string;
  align?: Location;
  noOverflowMask?: boolean;
  selectable?: boolean;
}

export interface GridCellInfo {
  row: number;
  col: number;
  data?: any;
}

export interface ScrollData {
  columns?: Column[];
  action?: ScrollDataAction;
  rows?: any[];
  start?: number;
  rowCount?: number;
}

export interface GridHeaderData {
  columns: Column[];
  data?: any[];
}

export interface GridBodyData {
  columns: Column[];
  data: any[];
  start?: number;
}

export interface GridRowMeta {
  title: any; // for cell title
  data: any; // for any data you need, it can be the original row data.
}

export interface Box {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}

export interface ChartSize {
  width: number;
  height: number;
  // container - margin size for easy using.
  chart?: {
    width?: number,
    height?: number
  };
  margin?: {
    left?: number,
    right?: number,
    bottom?: number,
    top?: number
  };
}

export interface ListItem {
  id?: any;
  name: string;
  value?: any;
  theme?: any;
}

/**
 * Basic Chart Data Structure. label for group label like "January", series: Product Name etc.
 * data: [
 *  { label: xx, values: [ { series: x, value: x, meta: {...} },... ]},
 *  { label: xx2, values: [...]},
 *  ...
 * ]
 */

export interface ChartItemData {
  series?: string;
  value: any;
  meta?: any;
}
export interface ChartData {
  label: string;
  values: ChartItemData[];
}

export interface ChartConfig {
  type?: ChartTypes;
  labels?: string[];
  series?: string[];
  data?: ChartData[];
  beautifyMinRatio?: number;
  beautibymaxRatio?: number;
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
  ticks?: number;
  min?: number; // fixed min
  max?: number; // fixed max
  hasXAxis?: boolean;
}

export interface BarLineChartConfig extends ChartConfig {
  barConfig: ChartConfig;
  lineConfig: ChartConfig;
}

export interface ChartDomain {
  min: number;
  max: number;
}



// ********* component config ***********
