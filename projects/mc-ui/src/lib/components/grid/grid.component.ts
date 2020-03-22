import { GridBodyComponent } from './grid-body.component';
import { ScrollComponent } from './../scroll/scroll.component';
import { debounceTime } from 'rxjs/operators';
import {
  GridHeaderConfig,
  GridBodyConfig,
  GridConfig,
  GridHeaderActionEvent,
  ScrollData,
  ScrollConfig,
  SortItem,
  SortDirection,
  Column,
  ScrollActionEvent,
  ScrollPage,
  GridActionEvent,
  ScrollAction,
  GridBodyActionEvent,
  GridRowMeta,
  ExtraHeightRow
} from '../../mc-ui.models';
import { BaseComponent } from './../base.component';
import { McUiService } from './../../mc-ui.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GridAction, ScrollDataAction } from '../../mc-ui.models';
import { isEmpty } from '../../utils/utils';
import { getAutoColumnWidth } from '../../utils/grid-utils';
import { getContainerWidth } from '../../utils/dom-utils';
import { Subscription } from 'rxjs';

interface State {
  scrollConfig: ScrollConfig;
  headerConfig: GridHeaderConfig;
  bodyHeight: number;
  bodyWidth: string;
}

interface BodyComponentMeta {
  subscription: Subscription;
  gridBodyComponent: GridBodyComponent;
}

@Component({
  selector: 'mc-grid',
  styleUrls: ['grid.component.scss'],
  templateUrl: './grid.component.html'
})
export class GridComponent extends BaseComponent {
  private defaultColumnWidth = 100;
  private lastContainerWidth: number;
  private resizedContainerWidth: number;
  private sortItem: SortItem = {
    fieldName: '',
    direction: SortDirection.ASC
  };
  private data: ScrollData;
  private renderedBodyComponentMetaMap = new Map<number, BodyComponentMeta>();
  private currentPagesMap: Map<number, ScrollPage>;
  private currentPageElements: Array<HTMLElement>;
  private idRowIndexMap = new Map<string, number>();
  private pageRowCount: number;

  state: State = {
    scrollConfig: null,
    headerConfig: null,
    bodyHeight: 0,
    bodyWidth: '100%'
  };

  _config: GridConfig = {
    columns: [],
    columnTpls: {},
    startRowIndex: 0,
    isLoading: false,
    selectedCell: null,
    columnWidthIsRatio: true,
    selectCellByMouseOver: false,
    emptyText: 'No Data',
    idField: 'id',
    rowHeight: 30,
    displayLoader: true,
    data: null,
    // header
    headerRowHeight: 30,
    headerTpls: {},
    headerData: null,
    atLeastOneSelectedColumnRequired: false,
    selectedColumns: [],
    // scroll
    loadingText: null,
    minPageRowCount: 20,
    rowCount: 0,
    // body accordion
    hasAccordionRow: false,
    accordionContentTpl: null,
    accordionContentHeight: 300,
    selectedRowsMap: null,
    multiSelectRow: false
  };

  @ViewChild(ScrollComponent) scrollCmp: ScrollComponent;

  constructor(protected er: ElementRef, protected service: McUiService) {
    super(er);
    this.subscriptions = service.windowResize.pipe(debounceTime(500)).subscribe(() => this.onResizeWindow());
  }

  afterInitCmp() {
    this.initSize(this._config);
  }

  applyConfig(config: GridConfig) {
    this.sortItem = this.getSortItem(config.columns);
    this.applyData(config);
  }

  setScrollConfig(config: GridConfig) {
    const scrollConfig: ScrollConfig = {
      themes: config.themes,
      loadingText: config.loadingText,
      emptyText: config.emptyText,
      rowHeight: config.rowHeight,
      isLoading: config.isLoading,
      displayLoader: config.displayLoader,
      minPageRowCount: config.minPageRowCount
    };
    this.setState({ scrollConfig });
  }

  setHeaderConfig(config: GridConfig) {
    if (!config.columns.length) {
      return;
    }
    const headerConfig: GridHeaderConfig = {
      themes: config.themes,
      rowHeight: config.headerRowHeight || config.rowHeight,
      tpls: config.headerTpls,
      data: config.headerData,
      columns: config.columns,
      atLeastOneSelectedColumnRequired: config.atLeastOneSelectedColumnRequired,
      selectedColumns: config.selectedColumns
    };
    this.setState({ headerConfig });
  }

  applyState(config: GridConfig) {
    this.setHeaderConfig(config);
  }

  getSortItem(columns: Array<Column>) {
    if (columns) {
      const sortCol = columns.find(col => !!col.sortDirection);
      if (sortCol) {
        return {
          fieldName: sortCol.field,
          direction: sortCol.sortDirection
        };
      }
    }
    return null;
  }

  applyData(config: GridConfig) {
    if (!config.data) {
      return;
    }
    const newData = config.data;
    const action = newData.action
      ? newData.action
      : newData.startRowIndex
      ? ScrollDataAction.APPEND
      : ScrollDataAction.INIT;
    const oldData = this.data || {};
    let columns = config.columns;
    let rowCount: number;
    let rows: any[];
    // Update Data
    switch (action) {
      case ScrollDataAction.INIT:
        rows = newData.rows;
        rows.forEach((row, rowIndex) => this.idRowIndexMap.set('' + row[config.idField], rowIndex));
        rowCount = newData.rowCount ? newData.rowCount : rows ? rows.length : null;
        columns = this.initColumns(columns, rows[0]);
        break;
      case ScrollDataAction.RELOAD:
      case ScrollDataAction.APPEND:
        rowCount = newData.rowCount ? newData.rowCount : oldData.rowCount;
        rows = oldData.rows.concat();
        const startRowIndex = newData.startRowIndex;
        newData.rows.forEach((d, i) => {
          rows[startRowIndex + i] = d;
          this.idRowIndexMap.set(d[config.idField], startRowIndex + i);
        });
        break;
    }
    config.rowCount = rowCount;
    this.data = {
      rows,
      rowCount
    };
    // Render Pages. This can be different from the added data since the added data can be async.
    switch (action) {
      case ScrollDataAction.INIT:
        if (this.rendered) {
          this.initSize(config);
        }
        break;
      // neededData is async so it needs to be reloaded all pages.
      case ScrollDataAction.APPEND:
        this.renderEmptyPages(this.currentPagesMap, this.currentPageElements);
        break;
      case ScrollDataAction.RELOAD:
        this.rerenderPages(this.currentPagesMap, this.currentPageElements);
        break;
    }
  }

  initColumns(columns: Array<Column>, row: any) {
    if (columns.length) {
      return columns;
    }
    if (row) {
      return Object.keys(row).map(key => ({ field: key }));
    }
    return [];
  }

  updateColumnWidth(config: GridConfig) {
    if (this.lastContainerWidth !== this.resizedContainerWidth) {
      config.columns = getAutoColumnWidth(
        config.columns,
        this.resizedContainerWidth,
        config.columnWidthIsRatio,
        this.defaultColumnWidth
      );
      this.lastContainerWidth = this.resizedContainerWidth;
    }
  }

  initSize(config: GridConfig, resize = false) {
    this.resizedContainerWidth = getContainerWidth(this.el);
    this.updateColumnWidth(config);
    setTimeout(() => {
      this.el.style.height = '100%';
      const headerEl = this.el.querySelector('mc-grid-header');
      const headerHeight = headerEl.clientHeight;
      let bodyHeight = this.el.clientHeight - headerHeight;
      if (!isEmpty(config.rowCount)) {
        const dataHeight = !config.rowCount ? config.rowHeight : config.rowHeight * config.rowCount;
        if (bodyHeight > dataHeight) {
          bodyHeight = dataHeight;
          this.el.style.height = 'auto';
        }
      }
      this.setState({ bodyHeight });
      setTimeout(() => {
        if (resize) {
          this.scrollCmp.reloadPages();
        } else {
          this.setScrollConfig(config);
        }
      });
    });
  }

  resize() {
    this.initSize(this._config, true);
  }

  getBodyConfig(config: GridConfig, data: Array<any>, pageIndex: number): GridBodyConfig {
    return {
      themes: config.themes,
      rowHeight: config.rowHeight,
      tpls: config.columnTpls,
      idField: config.idField,
      selectCellByMouseOver: config.selectCellByMouseOver,
      columns: config.columns,
      startRowIndex: config.startRowIndex,
      isLoading: config.isLoading,
      selectedCell: config.selectedCell,
      hasAccordionRow: config.hasAccordionRow,
      accordionContentTpl: config.accordionContentTpl,
      accordionContentHeight: config.accordionContentHeight,
      selectedRowsMap: config.selectedRowsMap,
      multiSelectRow: config.multiSelectRow,
      data,
      pageIndex
    };
  }

  renderGridBody(pageIndex: number, el: HTMLElement, data: Array<any>) {
    const gridBodyComponent = this.service.addComponent(GridBodyComponent, el);
    const instance = gridBodyComponent.instance as GridBodyComponent;
    instance.config = this.getBodyConfig(this._config, data, pageIndex);
    const subscription = instance.action.subscribe((e: GridBodyActionEvent) => {
      this.onGridBodyAction(e);
    });
    this.renderedBodyComponentMetaMap.set(pageIndex, {
      subscription,
      gridBodyComponent
    });
    return gridBodyComponent;
  }

  removeGridBody(pageIndex: number) {
    const meta = this.renderedBodyComponentMetaMap.get(pageIndex);
    if (meta) {
      meta.subscription.unsubscribe();
      this.service.removeComponent(meta.gridBodyComponent);
      this.renderedBodyComponentMetaMap.delete(pageIndex);
    }
  }

  getPagesDataMap(pagesMap: Map<number, ScrollPage>) {
    const rows = this.data.rows;
    const pagesDataMap = new Map<number, Array<any>>();
    pagesMap.forEach(page => {
      if (rows[page.startRowIndex] && rows[page.endRowIndex]) {
        pagesDataMap.set(page.index, rows.slice(page.startRowIndex, page.endRowIndex + 1));
      }
    });
    return pagesDataMap;
  }

  rerenderPages(pagesMap: Map<number, ScrollPage>, pageElements: Array<HTMLElement>) {
    const pagesData = this.getPagesDataMap(pagesMap);
    pagesMap.forEach(page => {
      this.removeGridBody(page.index);
      this.renderGridBody(page.index, pageElements[page.index], pagesData.get(page.index));
    });
  }

  renderEmptyPages(pagesMap: Map<number, ScrollPage>, pageElements: Array<HTMLElement>) {
    let neededStartRowIndex = Infinity;
    let neededEndRowIndex = -Infinity;
    const pagesDataMap = this.getPagesDataMap(pagesMap);
    pagesMap.forEach(page => {
      if (!this.renderedBodyComponentMetaMap.has(page.index)) {
        if (pagesDataMap.has(page.index)) {
          this.renderGridBody(page.index, pageElements[page.index], pagesDataMap.get(page.index));
        } else {
          neededStartRowIndex = Math.min(neededStartRowIndex, page.startRowIndex);
          neededEndRowIndex = Math.max(neededEndRowIndex, page.endRowIndex);
        }
      }
    });
    if (neededStartRowIndex !== Infinity) {
      this.emitAction({ action: GridAction.GET_DATA, neededStartRowIndex, neededEndRowIndex });
    }
  }

  emitAction(config: GridActionEvent) {
    this.action.emit(Object.assign(this.getBasicGridActionEvent(), config));
  }

  getBasicGridActionEvent(): GridActionEvent {
    return {
      target: this,
      selectedColumns: this._config.selectedColumns.concat(),
      sort: Object.assign({}, this.sortItem),
      selectedRowsMap: this._config.selectedRowsMap,
      pageRowCount: this.pageRowCount
    };
  }

  scrollById(id: string) {
    this.scrollCmp.scrollByRowIndex(this.idRowIndexMap.get(id));
  }

  getAccordionContentHeight(rowData: any) {
    const meta: GridRowMeta = rowData.__meta__ || {};
    return meta.accordionContentHeight || this._config.accordionContentHeight;
  }

  updatePagesHeight(rowData: any, accordionContentHeight: number) {
    const id = rowData[this._config.idField];
    const rowIndex = this.idRowIndexMap.get(id);
    const pageIndex = this.scrollCmp.getPageIndexByRowIndex(rowIndex);
    const extraHeightRow: ExtraHeightRow = {
      pageIndex,
      rowIndex,
      extraHeight: accordionContentHeight
    };
    const extraHeightPagesMap = this.scrollCmp.getExtraHeightPagesMap();
    const extraHeightPage = extraHeightPagesMap.get(pageIndex);
    extraHeightPage.extraHeightRowsMap.set(rowIndex, extraHeightRow);
    extraHeightPagesMap.set(pageIndex, extraHeightPage);
    this.scrollCmp.updatePagesExtraHeight(extraHeightPagesMap);
  }

  onResizeWindow() {
    this.resize();
  }

  onHeaderAction(e: GridHeaderActionEvent) {
    const action: GridAction = e.action;
    switch (action) {
      case GridAction.SELECT_COLUMN:
        this._config.selectedColumns = e.selectedColumns;
        this.emitAction({ action });
        break;
      case GridAction.SORT:
        this.sortItem = e.sort;
        this.emitAction({ action });
        break;
    }
  }

  onScrollAction(e: ScrollActionEvent) {
    const action = e.action;
    const pageElements = e.pageElements;
    this.pageRowCount = e.pageRowCount;
    this.currentPagesMap = e.currentPagesMap;
    this.currentPageElements = pageElements;
    switch (action) {
      case ScrollAction.UPDATE_PAGES:
        this.renderEmptyPages(e.currentPagesMap, pageElements);
        break;
      case ScrollAction.RELOAD_PAGES:
        this.rerenderPages(e.currentPagesMap, pageElements);
        break;
    }
  }

  onGridBodyAction(e: GridBodyActionEvent) {
    const config = this._config;
    switch (e.action) {
      case GridAction.SELECT_ROW:
        config.selectedRowsMap = e.selectedRowsMap;
        if (this._config.hasAccordionRow) {
          this.updatePagesHeight(e.rowData, this.getAccordionContentHeight(e.rowData));
        }
        this.emitAction(e);
        break;
      case GridAction.UNSELECT_ROW:
        config.selectedRowsMap = e.selectedRowsMap;
        if (this._config.hasAccordionRow) {
          this.updatePagesHeight(e.rowData, 0);
        }
        this.emitAction(e);
        break;
      case GridAction.SELECT_CELL:
        config.selectedCell = e.selectedCell;
        this.emitAction(e);
        break;
      case GridAction.MOUSEOVER_CELL:
        config.selectedCell = e.selectedCell;
        this.emitAction(e);
        break;
    }
  }

  destroyCmp() {
    this.currentPageElements = null;
    this.renderedBodyComponentMetaMap.forEach((comp, pageIndex) => this.removeGridBody(pageIndex));
    this.renderedBodyComponentMetaMap = null;
  }
}
