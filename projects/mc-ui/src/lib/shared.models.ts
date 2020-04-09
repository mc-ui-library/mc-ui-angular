import { TemplateRef } from '@angular/core';
// ************* common component enums **************

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

export enum Icon {
  menu = 'menu',
  logo = 'logo',
  user = 'user',
  list = 'list',
  downloadGreen = 'download-green',
  download = 'download',
  arrowLeft = 'arrow-left',
  close = 'close',
  arrowDown = 'arrow-down',
  chevron = 'chevron'
}

export enum ComponentTheme {
  gridBodyAccordion = 'grid-body-accordion,',
  gridHeaderSort = 'grid-header-sort',
  horizontal = 'horizontal',
  popup = 'popup'
}

export enum PopupStartFrom {
  TOP,
  BOTTOM
}

export enum Location {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM'
}

export enum InputType {
  text = 'text',
  number = 'number',
  search = 'search',
  email = 'email',
  tel = 'tel',
  url = 'url',
  range = 'range',
  datetimeLocal = 'datetime-local',
  month = 'month',
  time = 'time',
  week = 'week',
  date = 'date',
  color = 'color'
}

export enum DataType {
  STRING,
  NUMBER,
  DATE
}

// ***** Component Action ****** Action need to have a string, since they can be 'data-action'.

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

export enum ScrollbarAction {
  SCROLL_Y = 'SCROLL_Y',
  SCROLL_Y_END = 'SCROLL_Y_END'
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
  UNSELECT_ROW = 'UNSELECT_ROW',
  REMOVE_PAGE = 'REMOVE_PAGE'
}

export enum GridAccordionAction {
  UNSELECT_ROW = 'UNSELECT_ROW',
  SELECT_ROW = 'SELECT_ROW',
  SELECT_CELL = 'SELECT_CELL',
  SORT = 'SORT'
}

export enum ScrollAction {
  UPDATE_PAGES = 'UPDATE_PAGES',
  GET_ROW_COUNT = 'GET_ROW_COUNT'
}

export enum InputAction {
  CHANGE = 'CHANGE',
  KEY_UP = 'KEY_UP'
}

export enum VisualizerAction {
  SELECT_ITEM = 'SELECT_ITEM',
  RENDERED = 'RENDERED',
}

export enum VisualizerType {
  GRID,
  BAR,
  HORIZONTAL_BAR,
  LINE,
  BAR_LINE
}

export enum VisualizerScaleType {
  LINEAR,
  BAND
}

export enum VisualizerMetaField {
  total = '__total__'
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
  displayLoader?: boolean;
  rowCount?: number;
  minPageRowCount?: number;
}

export interface PopupConfig extends ComponentConfig {
  checkTargetLocation?: boolean;
  startFrom?: PopupStartFrom;
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
  selected?: boolean;
  horizontal: boolean;
}

export interface LegendListConfig extends ComponentConfig {
  data?: Array<ListItem>;
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
  selectableCell?: boolean;
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
  selectedRows?: Array<any>;
  multiSelectRow?: boolean;
  adjustHeight?: boolean;
}

export interface GridHeaderConfig extends ComponentConfig {
  rowHeight?: number;
  tpls?: any;
  data?: Array<Array<GridHeaderCell>>;
  atLeastOneSelectedColumnRequired?: boolean;
  selectedColumns?: Array<Column>;
  sortItem?: SortItem;
}

export interface GridBodyConfig extends ComponentConfig {
  rowHeight?: number;
  idField?: string;
  tpls?: any;
  selectCellByMouseOver?: boolean;
  data?: Array<any>;
  columns?: Array<Column>;
  startRowIndex?: number;
  selectableCell?: boolean;
  selectedCell?: GridCellInfo;
  hasAccordionRow?: boolean;
  accordionContentTpl?: TemplateRef<any>;
  accordionContentHeight?: number;
  selectedRows?: Array<any>;
  multiSelectRow?: boolean;
  pageIndex?: number;
}

export interface VisualizerConfig extends ComponentConfig {
  type: VisualizerType;
  gridConfig?: GridConfig; // type's config
  dataFields?: Array<string>;
  data2Fields?: Array<string>; // for bar-line chart etc.
  labelField?: string;
  hasGrid?: boolean;
  data: VisualizerData;
  ticks?: number;
  scalePadding?: number;
  scalePaddingInner?: number;
  scalePaddingOuter?: number;
}

export interface TextConfig extends ComponentConfig {
  type: InputType;
  name: string;
  value: string;
  placeholder: string;
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

export interface ScrollbarActionEvent extends ComponentEvent {
  action: ScrollbarAction;
}

export interface ScrollActionEvent extends ComponentEvent {
  action: ScrollAction;
  currentPageIndexes?: Array<number>;
  addingPageIndexes?: Array<number>;
  removingPageIndexes?: Array<number>;
  pageElements?: Array<HTMLElement>;
  pageRowCount?: number;
  pages?: Array<ScrollPage>;
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
  accordionContentEl?: HTMLElement;
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
  pageRowCount?: number;
  pageIndex?: number;
}

export interface InputActionEvent extends ComponentEvent {
  action: InputAction;
  oldValue?: string;
  value: string;
  name: string;
}

export interface VisualizerActionEvent extends ComponentEvent {
  action?: VisualizerAction;
  config?: VisualizerConfig;
  renderInfo?: VisualizerRenderInfo;
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
  top: number;
}

export interface GridRowDataMeta {
  id: string;
  pageIndex: number;
  rowIndex: number;
  rowData: any;
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
  type?: DataType;
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

export interface ExtraHeightPage {
  pageIndex: number;
  extraHeight: number;
}

export interface VisualizerSize {
  width: number;
  height: number;
  // container - margin size for easy using.
  chart?: {
    width?: number;
    height?: number;
  };
  margin?: {
    left?: number;
    right?: number;
    bottom?: number;
    top?: number;
  };
}

/**
 * Visualizer Basic Data Structure
 */

export interface VisualizerData {
  columns: Array<Column>;
  data: Array<any>;
}

export interface VisualizerItemDomain {
  min: number;
  max: number;
}

export interface Filter {
  field: string;
  type?: DataType;
  keyword: string;
}

export interface MinMax {
  min: number;
  max: number;
}

export interface VisualizerUnit {
  yScale?: any;
  yAxis?: any;
  xScale?: any;
  xScaleInner?: any;
  xAxis?: any;
  y2Scale?: any;
  y2Axis?: any;
  labels?: Array<string>;
  colorScale?: any;
  fields?: Array<string>;
  fields2?: Array<string>;
  minMax?: MinMax;
  minMax2?: MinMax;
}

export interface VisualizerRenderInfo {
  svg?: any;
  unit?: VisualizerUnit;
  size?: VisualizerSize;
}
