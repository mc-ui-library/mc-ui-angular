import { TemplateRef } from '@angular/core';
// ************* common component enums **************
// Action need to have a string, since they can be 'data-action'.

export enum ListAction {
  UNSELECT_ITEM = 'UNSELECT_ITEM',
  SELECT_ITEM = 'SELECT_ITEM'
}

export enum ScrollDataAction {
  INIT = 'INIT',
  APPEND = 'APPEND',
  RELOAD = 'RELOAD',
  INSERT = 'INSERT',
  SORT = 'SORT'
}

export enum ComponentAction {
  RENDERED = 'RENDERED',
  HID = 'HID'
}

export enum GridAction {
  SELECT_CELL = 'SELECT_CELL',
  SORT = 'SORT',
  MOUSEOVER_CELL = 'MOUSEOVER_CELL',
  UPDATE_WIDTH = 'UPDATE_WIDTH',
  LOADED = 'LOADED',
  SELECT_COLUMN = 'SELECT_COLUMN',
  GET_DATA = 'GET_DATA',
  SELECT_ROW = 'SELECT_ROW',
  UNSELECT_ROW = 'UNSELECT_ROW'
}

export enum GridAccordionAction {
  UNSELECT_ROW = 'UNSELECT_ROW',
  SELECT_ROW = 'SELECT_ROW',
  SELECT_CELL = 'SELECT_CELL',
  SORT = 'SORT'
}

export enum ScrollAction {
  UPDATE_PAGES = 'UPDATE_PAGES',
  RELOAD_PAGES = 'RELOAD_PAGES'
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

// ************* shared component interface **************

// **** component config ****
export interface ComponentConfig {
  themes?: Array<string>;
}

export interface ScrollbarConfig extends ComponentConfig {
  suppressScrollX?: boolean;
}

export interface ScrollConfig extends ComponentConfig {
  loadingText?: string;
  emptyText?: string;
  rowHeight?: number;
  isLoading?: boolean;
  displayLoader?: boolean;
  rowCount?: number;
  minPageRowCount?: number;
}

export interface PopupConfig extends ComponentConfig {
  checkTargetLocation?: boolean;
  startFrom?: 'center' | 'start' | 'overlap';
  offsetX?: number;
  offsetY?: number;
  tpl?: TemplateRef<any>;
  targetEl?: HTMLElement;
  hasIndicator?: boolean;
  center?: boolean;
  hasBorder?: boolean;
  hasCloseButton?: boolean;
}

export interface MaskConfig extends ComponentConfig {
  visible: boolean;
  transparent: boolean;
}

export interface ListConfig extends ComponentConfig {
  rowHeight?: number;
  multiSelect?: boolean;
  toggleSelect?: boolean;
  selectedItems?: Array<ListItem>;
  data?: Array<ListItem>;
  itemTpl?: TemplateRef<any>;
  idField?: string;
  nameField?: string;
  horizontal?: boolean;
}

export interface ListItemConfig extends ComponentConfig {
  tpl: TemplateRef<any>;
  data: ListItem;
  idField: string;
  nameField: string;
  toggleSelect: boolean;
  height: number;
  selected: boolean;
  horizontal: boolean;
}

export interface LegendListConfig extends ComponentConfig {
  data: Array<ListItem>;
}

export interface IconConfig extends ComponentConfig {
  icon: string;
}

export interface DrawerConfig extends ComponentConfig {
  from?: string | 'top' | 'left' | 'right' | 'bottom';
  tpl?: TemplateRef<any>;
  mask?: boolean;
}

export interface GridConfig extends ComponentConfig {
  columns?: Array<Column>;
  columnTpls?: any;
  startRowIndex?: number;
  isLoading?: boolean;
  selectedCell?: GridCellInfo;
  columnWidthIsRatio?: boolean;
  selectCellByMouseOver?: boolean;
  emptyText?: string;
  idField?: string;
  rowHeight?: number;
  displayLoader?: boolean;
  data?: ScrollData;
  // header
  headerTpls?: any;
  headerRowHeight?: number;
  headerData?: Array<Array<GridHeaderCell>>;
  atLeastOneSelectedColumnRequired?: boolean;
  selectedColumns?: Array<Column>;
  // scroll
  loadingText?: string;
  minPageRowCount?: number;
  rowCount?: number;
  // body accordion
  hasAccordionRow?: boolean;
  accordionContentTpl?: TemplateRef<any>;
  accordionContentHeight?: number;
  selectedRowsMap?: Map<string, any>;
  multiSelectRow?: boolean;
}

export interface GridHeaderConfig extends ComponentConfig {
  rowHeight?: number;
  tpls?: any;
  data?: Array<Array<GridHeaderCell>>;
  columns?: Array<Column>;
  atLeastOneSelectedColumnRequired?: boolean;
  selectedColumns?: Array<Column>;
}

export interface GridBodyConfig extends ComponentConfig {
  rowHeight?: number;
  idField?: string;
  tpls?: any;
  selectCellByMouseOver?: boolean;
  data?: Array<any>;
  columns?: Array<Column>;
  startRowIndex?: number;
  isLoading?: boolean;
  selectedCell?: GridCellInfo;
  hasAccordionRow?: boolean;
  accordionContentTpl?: TemplateRef<any>;
  accordionContentHeight?: number;
  selectedRowsMap?: Map<string, any>;
  multiSelectRow?: boolean;
  pageIndex?: number;
}

// **** component action event ****

export interface ComponentEvent {
  target?: any; // component instance
  event?: any; // for dom event
  data?: any;
  el?: HTMLElement;
}

export interface ComponentActionEvent extends ComponentEvent {
  action: ComponentAction;
}

export interface ScrollActionEvent extends ComponentEvent {
  action: ScrollAction;
  currentPagesMap?: Map<number, ScrollPage>;
  addingPagesMap?: Map<number, ScrollPage>;
  removingPagesMap?: Map<number, ScrollPage>;
  pageElements: Array<HTMLElement>;
  pageRowCount: number;
}

export interface ListItemActionEvent extends ComponentEvent {
  action: ListAction; // action type
  selected: boolean;
  data: ListItem;
}

export interface GridHeaderActionEvent extends ComponentEvent {
  action?: GridAction; // action type
  column?: Column;
  selectedColumns?: Array<Column>;
  sort?: SortItem;
}

export interface GridBodyActionEvent extends ComponentEvent {
  action?: GridAction; // action type
  id?: string;
  cellEl?: HTMLElement;
  rowEl?: HTMLElement;
  rowIndex?: number;
  cellIndex?: number;
  field?: string;
  rowData?: any;
  cellData?: any;
  selectedCell?: GridCellInfo;
  accordionContentHeight?: number;
  accordionContentEl?: HTMLElement;
  selectedRowsMap?: Map<string, any>;
  pageIndex?: number;
}

export interface ListActionEvent extends ComponentEvent {
  action: any; // action type
  selectedItem?: any;
  selectedItems?: any[];
  sort?: SortItem;
}

export interface GridActionEvent extends ComponentEvent {
  action?: GridAction;
  selectedColumns?: Column[];
  cellData?: any;
  cellIndex?: number;
  cellEl?: HTMLElement;
  rowEl?: HTMLElement;
  field?: string;
  id?: any;
  rowData?: any;
  rowIndex?: number;
  selectedCell?: any;
  sort?: SortItem;
  neededStartRowIndex?: number;
  neededEndRowIndex?: number;
  accordionContentEl?: HTMLElement;
  selectedRows?: Array<any>;
  selectedRowsMap?: Map<string, any>;
  pageRowCount?: number;
}

// **** data type ****

// for extra grid row information
export interface GridRowMeta {
  accordionContentHeight?: number;
  class?: string;
  fieldMeta?: any;
}

// GridRowMeta.fieldMeta
export interface GridFieldMeta {
  title: string;
  data: any;
}

export interface Message {
  from?: string;
  to: string;
  action: string;
  data?: any;
}

export interface ListItem {
  id?: any;
  name?: string;
  value?: any;
  theme?: any;
}

export interface ScrollPage {
  startRowIndex: number;
  endRowIndex: number;
  index: number;
  height: number;
  extraHeight: number;
}

export interface ExtraHeightRow {
  pageIndex: number;
  rowIndex: number;
  extraHeight: number;
}

export interface ExtraHeightPage {
  pageIndex: number;
  extraHeightRowsMap: Map<number, ExtraHeightRow>;
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

export interface GridHeaderCell extends Column {
  colspan?: number;
  rowspan?: number;
  isLastRow?: boolean;
  isFirstRow?: boolean;
  isFirstCol?: boolean;
  isLastCol?: boolean;
}

export interface GridCellInfo {
  row: number;
  col: number;
  data?: any;
}

export interface ScrollData {
  action?: ScrollDataAction;
  rows?: any[];
  startRowIndex?: number;
  rowCount?: number;
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
