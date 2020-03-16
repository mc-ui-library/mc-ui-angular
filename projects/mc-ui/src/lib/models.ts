// ************* common component enums **************
export enum ListAction {
  UNSELECTED_ITEM = 'UNSELECTED_ITEM',
  SELECTED_ITEM = 'SELECTED_ITEM'
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
  LOADED = 'LOADED',
  SELECT_COLUMN = 'SELECT_COLUMN'
}

export enum GridAccordionAction {
  UNSELECT_ROW = 'UNSELECT_ROW',
  SELECT_ROW = 'SELECT_ROW',
  SELECT_CELL = 'SELECT_CELL',
  SORT = 'SORT',
}

export enum ScrollAction {
  UPDATE_PAGES
}

export enum Align {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM'
}

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC'
}

// ************* common component interface **************

export interface ComponentConfig {
  themes?: Array<string>;
}

export interface ScrollbarConfig extends ComponentConfig {
  suppressScrollX?: boolean;
}

export interface ScrollConfig extends ComponentConfig {
  loadingText?: string;
  emptyText?: string;
  page1Tpl?: null;
  page2Tpl?: null;
  rowHeight?: number;
  isLoading?: boolean;
  displayLoader?: boolean;
  rowCount?: number;
}

export interface Message {
  from?: string;
  to: string;
  action: string;
  data?: any;
}

export interface ListItem {
  id?: any;
  name: string;
  value?: any;
  theme?: any;
}

export interface ScrollPage {
  startRowIndex: number;
  endRowIndex: number;
  top: number;
  bottom: number;
  pageContainerIndex: number; // 0 or 1
  index: number;
}

export interface ComponentEvent {
  target: any; // component instance
  event?: any; // for dom event
  data?: any;
}

export interface ActionEvent extends ComponentEvent {
  action: any; // action type
  selectedItem?: any;
  selectedItems?: any[];
  sort?: SortItem;
  el?: HTMLElement;
}

export interface GridActionEvent extends ActionEvent {
  action: GridAction;
  selectedColumns?: Column[];
  cellData?: any;
  cellIndex?: number;
  el?: HTMLElement;
  field?: string;
  id?: any;
  rowData?: any;
  rowIndex?: number;
  selectedCell?: any;
}

export interface ScrollActionEvent extends ComponentEvent {
  action: ScrollAction;
  pages?: Array<ScrollPage>;
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
  align?: Align;
  noOverflowMask?: boolean;
  selectable?: boolean;
  selectableHeader?: boolean;
  selected?: boolean; // for selectable header
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
  columns: Column[],
  data?: any[];
  rowHeight?: number;
  atLeastOneSelectedItemRequired?: boolean;
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

export interface GridNeedDataEvent {
  target: any;
  index: number;
  pageIndex: number;
  pageRowCount: number;
  page1Index: number;
  page2Index: number;
  action: ScrollDataAction;
  sort: SortItem;
}

export interface Box {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}
