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
  Align,
  GridRowMeta,
  ExtraHeightPage
} from './../../shared.models';
import { BaseComponent } from './../base.component';
import { SharedService } from './../../shared.service';
import { Component, ElementRef, ViewChild, Input, ComponentRef } from '@angular/core';
import { GridAction, ScrollDataAction } from '../../shared.models';
import { isEmpty } from '../../utils/utils';
import { getAutoColumnWidth } from '../../utils/grid-utils';
import { getContainerWidth } from '../../utils/dom-utils';
import { Subscription } from 'rxjs';

/**
 * Only one accordion content can be opened.
 * When scrolling and the page is removed, the opened accordion will be closed.
 * The before remove page event will be fired for giving a chance to clean up the accordion contents.
 * The parent component should remove the dynamic component for the accordion content before removing the container page.
 */

const ACCORDION_ARROW_COLUMN = {
  field: '__arrow__',
  name: '',
  width: 50,
  fixedWidth: true,
  align: Align.CENTER,
  noOverflowMask: true
};

interface State {
  scrollConfig?: ScrollConfig;
  headerConfig?: GridHeaderConfig;
  columns?: Array<Column>;
  bodyHeight?: number;
  bodyWidth: string;
}

interface BodyComponentMeta {
  subscription: Subscription;
  gridBodyComponentRef: ComponentRef<GridBodyComponent>;
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
  private renderedBodyComponentMetaMap = new Map<number, BodyComponentMeta>();
  private pages: Array<ScrollPage>;
  private currentPageIndexes: Array<number>;
  private emptyPageIndexes: Array<number> = [];
  private pageElements: Array<HTMLElement>;
  private idRowIndexMap = new Map<string, number>();
  private pageRowCount: number;
  private renderedPagesMap = new Set<number>();
  private selectedRowsMap = new Map<string, any>();
  private openedAccordionPageIndex: number;

  private _data: ScrollData;

  defaultState: State = {
    scrollConfig: null,
    headerConfig: null,
    bodyHeight: 0,
    bodyWidth: '100%'
  };

  state: State;

  defaultConfig: GridConfig = {
    columns: [],
    columnTpls: {},
    startRowIndex: 0,
    selectableCell: false,
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
    // body accordion
    hasAccordionRow: false,
    accordionContentTpl: null,
    accordionContentHeight: 300,
    selectedRows: [],
    multiSelectRow: false,
    adjustHeight: true
  };

  _config: GridConfig;

  @Input()
  set data(data: ScrollData) {
    if (!data) {
      return;
    }
    const newData = data;
    const action = newData.action
      ? newData.action
      : newData.startRowIndex
      ? ScrollDataAction.APPEND
      : ScrollDataAction.INIT;
    const oldData = this._data || {};
    let rowCount: number;
    let rows: any[];
    // Update Data
    switch (action) {
      case ScrollDataAction.INIT:
        this.renderedPagesMap = new Set<number>();
        rows = newData.rows;
        rows.forEach((row, rowIndex) => this.idRowIndexMap.set(this.getStringRowID(row), rowIndex));
        rowCount = newData.rowCount ? newData.rowCount : rows ? rows.length : null;
        this.selectedRows = [];
        if (this.rendered) {
          this.removeGridBodyAll();
          this.updateBodySize(rowCount);
        }
        // rerender scroll component
        this.scrollCmp.rowCount = rowCount;
        break;
      case ScrollDataAction.RELOAD:
      case ScrollDataAction.APPEND:
        rowCount = newData.rowCount ? newData.rowCount : oldData.rowCount;
        rows = oldData.rows.concat();
        const startRowIndex = newData.startRowIndex;
        newData.rows.forEach((d, i) => {
          rows[startRowIndex + i] = d;
          this.idRowIndexMap.set(this.getStringRowID(d), startRowIndex + i);
        });
        break;
    }
    this.scrollCmp.isLoading = false;
    this._data = {
      rows,
      rowCount
    };
    // Render Pages. This can be different from the added data since the added data can be async.
    switch (action) {
      case ScrollDataAction.INIT:
        break;
      // neededData is async so it needs to be reloaded all pages.
      case ScrollDataAction.APPEND:
        this.renderPages(this.emptyPageIndexes);
        break;
      case ScrollDataAction.RELOAD:
        this.rerenderPages();
        break;
    }
  }
  get data() {
    return this._data;
  }

  @Input()
  set selectedRows(selectedRows: Array<any>) {
    if (selectedRows) {
      this.selectedRowsMap = selectedRows.reduce(
        (map, row) => map.set(this.getStringRowID(row), row),
        new Map<string, any>()
      );
      this.applySelectedRows();
    }
  }

  @ViewChild(ScrollComponent) scrollCmp: ScrollComponent;

  constructor(protected er: ElementRef, protected service: SharedService) {
    super(er);
    this.subscriptions = service.windowResize.pipe(debounceTime(500)).subscribe(() => this.onResizeWindow());
  }

  applyConfig(config: GridConfig) {
    this.initColumns(config);
  }

  applyState(config: GridConfig) {
    this.selectedRows = this._config.selectedRows;
    this.setHeaderConfig(this._config);
    this.setScrollConfig(this._config);
    this.sortItem = this.getSortItem(config.columns);
    this.data = config.data;
    this.initSize(this._config);
  }

  initColumns(config: GridConfig) {
    const columns = config.columns;
    const len = columns.length;
    config.selectedColumns = columns.reduce((selectedColumns, column) => {
      if (column.selected) {
        selectedColumns.push(column);
      }
      return selectedColumns;
    }, []);
    if (config.hasAccordionRow && columns.length && columns[len - 1].field !== '__arrow__') {
      columns.push(ACCORDION_ARROW_COLUMN);
      config.columns = columns;
    }
  }

  applySelectedRows(removed = false) {
    // after rendering the grid body, the accordion can be opened.
    // the grid body can report it has a opened accordion.
    // then the scroll component can notice the body height change and it will update the page container height.
    // only the rendered page containers can have the extra height that from the body component.
    this.renderedBodyComponentMetaMap.forEach((bodyComponentMeta, pageIndex) => {
      const ref = bodyComponentMeta.gridBodyComponentRef;
      ref.instance.selectedRows = this.getSelectedRows();
      // after rendering grid body
      if (!removed) {
        setTimeout(() => this.addExtraHeight(pageIndex, ref));
      }
    });
  }

  addExtraHeight(pageIndex: number, bodyCmpRef: ComponentRef<GridBodyComponent>) {
    if (this._config && this._config.hasAccordionRow) {
      // need to know the selected row's page index
      const selectedRows = bodyCmpRef.instance.getSelectedRowsOfGridBody();
      if (selectedRows.length) {
        const accordionHeight = this.getAccordionContentHeight(selectedRows[0]);
        const extraHeightPages: Array<ExtraHeightPage> = [];
        if (!isEmpty(this.openedAccordionPageIndex)) {
          extraHeightPages.push({
            pageIndex: this.openedAccordionPageIndex,
            extraHeight: 0
          });
        }
        extraHeightPages.push({
          pageIndex,
          extraHeight: accordionHeight
        });
        this.scrollCmp.updateExtraHeight(extraHeightPages);
        this.openedAccordionPageIndex = pageIndex;
      }
    }
  }

  applySelectedCell() {
    this.renderedBodyComponentMetaMap.forEach(
      bodyComponentMeta => (bodyComponentMeta.gridBodyComponentRef.instance.selectedCell = this._config.selectedCell)
    );
  }

  setScrollConfig(config: GridConfig) {
    const scrollConfig: ScrollConfig = {
      themes: config.themes,
      loadingText: config.loadingText,
      emptyText: config.emptyText,
      rowHeight: config.rowHeight,
      displayLoader: config.displayLoader,
      minPageRowCount: config.minPageRowCount
    };
    this.setState({ scrollConfig });
  }

  setHeaderConfig(config: GridConfig) {
    const headerConfig: GridHeaderConfig = {
      themes: config.themes,
      rowHeight: config.headerRowHeight || config.rowHeight,
      tpls: config.headerTpls,
      data: config.headerData,
      atLeastOneSelectedColumnRequired: config.atLeastOneSelectedColumnRequired,
      selectedColumns: config.selectedColumns
    };
    this.setState({ headerConfig });
  }

  getStringRowID(row: any) {
    return '' + row[this._config.idField];
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

  updateColumnWidth(config: GridConfig) {
    if (this.lastContainerWidth !== this.resizedContainerWidth) {
      config.columns = getAutoColumnWidth(
        config.columns,
        this.resizedContainerWidth,
        config.columnWidthIsRatio,
        this.defaultColumnWidth
      );
      this.lastContainerWidth = this.resizedContainerWidth;
      this.setState({ columns: config.columns });
    } else {
      if (!this.state.columns) {
        this.setState({ columns: config.columns });
      }
    }
  }

  initSize(config: GridConfig, resize = false) {
    this.resizedContainerWidth = getContainerWidth(this.el.parentElement);
    if (!this.state.columns || resize) {
      this.updateColumnWidth(config);
    }
    const rowCount = this.data ? this.data.rowCount : this._config.rowCount;
    this.updateBodySize(rowCount);
    if (resize) {
      // after rendering header and body
      this.rerenderPages();
    } else {
      if (rowCount) {
        this.scrollCmp.rowCount = rowCount;
      }
    }
  }

  updateBodySize(rowCount: number) {
    const config = this._config;
    const rowHeight = config.rowHeight;
    this.el.style.height = '100%';
    const headerEl = this.el.querySelector('mc-grid-header');
    const headerHeight = headerEl.clientHeight;
    let bodyHeight = this.el.clientHeight - headerHeight;
    if (config.adjustHeight && !isEmpty(rowCount)) {
      const dataHeight = !rowCount ? rowHeight : rowHeight * rowCount;
      if (bodyHeight > dataHeight) {
        bodyHeight = dataHeight;
        this.el.style.height = 'auto';
      }
    }
    this.setState({ bodyHeight });
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
      startRowIndex: pageIndex * this.pageRowCount,
      selectableCell: config.selectableCell,
      selectedCell: config.selectedCell,
      hasAccordionRow: config.hasAccordionRow,
      accordionContentTpl: config.accordionContentTpl,
      accordionContentHeight: config.accordionContentHeight,
      selectedRows: this.getSelectedRows(),
      multiSelectRow: config.multiSelectRow,
      data,
      pageIndex
    };
  }

  renderGridBody(pageIndex: number, el: HTMLElement, data: Array<any>) {
    this.renderedPagesMap.add(pageIndex);
    const gridBodyComponentRef: ComponentRef<GridBodyComponent> = this.service.addComponent(GridBodyComponent, el);
    const instance = gridBodyComponentRef.instance;
    instance.config = this.getBodyConfig(this._config, data, pageIndex);
    const subscription = instance.action.subscribe((e: GridBodyActionEvent) => {
      this.onGridBodyAction(e);
    });
    this.renderedBodyComponentMetaMap.set(pageIndex, {
      subscription,
      gridBodyComponentRef
    });
    // after rendering grid
    setTimeout(() => this.addExtraHeight(pageIndex, gridBodyComponentRef));
    return gridBodyComponentRef;
  }

  removeGridBody(pageIndex: number) {
    // remove the extra height of the page container
    this.renderedPagesMap.delete(pageIndex);
    const meta = this.renderedBodyComponentMetaMap.get(pageIndex);
    if (meta) {
      this.emitAction({ action: GridAction.REMOVE_PAGE, pageIndex });
      meta.subscription.unsubscribe();
      this.service.removeComponent(meta.gridBodyComponentRef);
      this.renderedBodyComponentMetaMap.delete(pageIndex);
    }
  }

  removeGridBodyAll() {
    this.renderedBodyComponentMetaMap.forEach((bodyComponentMeta, pageIndex) => this.removeGridBody(pageIndex));
  }

  emitAction(config: GridActionEvent) {
    this.action.emit(Object.assign(this.getBasicGridActionEvent(), config));
  }

  getSelectedRows() {
    return [...this.selectedRowsMap.values()];
  }

  getBasicGridActionEvent(): GridActionEvent {
    return {
      target: this,
      selectedColumns: this._config.selectedColumns.concat(),
      sort: Object.assign({}, this.sortItem),
      selectedRows: this.getSelectedRows(),
      pageRowCount: this.pageRowCount * 2 // basically 2 pages need to be loaded at once
    };
  }

  getAccordionContentHeight(row: any) {
    const meta: GridRowMeta = row && row.__meta__ ? row.__meta__ : {};
    return meta.accordionContentHeight || this._config.accordionContentHeight;
  }

  scrollById(id: any): number {
    id = '' + id;
    const rowIndex = this.idRowIndexMap.get(id);
    if (!isEmpty(rowIndex)) {
      this.scrollCmp.scrollByRowIndex(rowIndex);
    } else {
      console.warn('There is no row data, Please get the row data first.');
    }
    return rowIndex;
  }

  scrollByIdAndSelectRow(id: any) {
    const rowIndex = this.scrollById(id);
    const rowEl: HTMLElement = this.el.querySelector(`[data-id="${id}"]`);
    if (rowEl) {
      rowEl.click();
      const accordionAnimationDuration = 400;
      // adjust scroll
      setTimeout(() => this.scrollCmp.scrollByRowIndex(rowIndex), accordionAnimationDuration);
      return true;
    }
    return false;
  }

  selectRow(rowData: any) {
    const config = this._config;
    if (!config.multiSelectRow || config.hasAccordionRow) {
      this.selectedRowsMap.clear();
    }
    this.selectedRowsMap.set(this.getStringRowID(rowData), rowData);
    this.applySelectedRows();
  }

  unselectRow(id: string, pageIndex: number) {
    this.selectedRowsMap.delete(id);
    if (this._config.hasAccordionRow) {
      this.scrollCmp.updateExtraHeight([{ pageIndex, extraHeight: 0 }]);
      this.openedAccordionPageIndex = null;
    }
    this.applySelectedRows(true);
  }

  renderPages(pageIndexes: Array<number>) {
    const pages = this.pages;
    const pageElements = this.pageElements;
    const emptyPageIndexes: Array<number> = [];
    let neededStartRowIndex = Infinity;
    let neededEndRowIndex = -Infinity;
    const rows = this.data.rows;
    pageIndexes.forEach(pageIndex => {
      const page = pages[pageIndex];
      if (rows[page.startRowIndex] && rows[page.endRowIndex]) {
        if (!this.renderedPagesMap.has(pageIndex)) {
          this.renderGridBody(pageIndex, pageElements[pageIndex], rows.slice(page.startRowIndex, page.endRowIndex + 1));
        }
      } else {
        emptyPageIndexes.push(pageIndex);
        neededStartRowIndex = Math.min(neededStartRowIndex, page.startRowIndex);
        neededEndRowIndex = Math.max(neededEndRowIndex, page.endRowIndex);
      }
    });
    this.emptyPageIndexes = emptyPageIndexes;
    if (neededStartRowIndex !== Infinity) {
      this.scrollCmp.isLoading = true;
      this.emitAction({ action: GridAction.GET_DATA, neededStartRowIndex, neededEndRowIndex });
    }
  }

  rerenderPages() {
    this.removeGridBodyAll();
    this.renderPages(this.currentPageIndexes);
  }

  getRemovingPageIndexes(oldIndexes: Array<number>, newIndexes: Array<number>) {
    return oldIndexes.filter(i => !newIndexes.includes(i));
  }

  onResizeWindow() {
    this.resize();
  }

  onHeaderAction(e: GridHeaderActionEvent) {
    const action: GridAction = e.action;
    switch (action) {
      case GridAction.SELECT_COLUMN:
        this._config.selectedColumns = e.selectedColumns;
        this.scrollCmp.isLoading = true;
        this.emitAction({ action });
        break;
      case GridAction.SORT:
        this.sortItem = e.sort;
        this.scrollCmp.isLoading = true;
        this.emitAction({ action });
        break;
    }
  }

  onScrollAction(e: ScrollActionEvent) {
    const action = e.action;
    switch (action) {
      case ScrollAction.UPDATE_PAGES:
        this.pages = e.pages;
        this.pageElements = e.pageElements;
        this.pageRowCount = e.pageRowCount;
        const oldPageIndexes = this.currentPageIndexes;
        this.currentPageIndexes = e.currentPageIndexes;
        if (action === ScrollAction.UPDATE_PAGES) {
          const removePageIndexes = this.getRemovingPageIndexes(oldPageIndexes || [], this.currentPageIndexes);
          removePageIndexes.forEach(pageIndex => this.removeGridBody(pageIndex));
          this.renderPages(this.currentPageIndexes);
        } else {
          this.rerenderPages();
        }
        break;
      case ScrollAction.GET_ROW_COUNT:
        this.scrollCmp.isLoading = true;
        this.pageRowCount = e.pageRowCount;
        this.emitAction({ action: GridAction.GET_DATA, neededStartRowIndex: 0 });
        break;
    }
  }

  onGridBodyAction(e: GridBodyActionEvent) {
    const config = this._config;
    switch (e.action) {
      case GridAction.SELECT_ROW:
        this.selectRow(e.rowData);
        this.emitAction(e);
        break;
      case GridAction.UNSELECT_ROW:
        this.unselectRow(e.id, e.pageIndex);
        this.emitAction(e);
        break;
      case GridAction.SELECT_CELL:
      case GridAction.MOUSEOVER_CELL:
        config.selectedCell = e.selectedCell;
        this.applySelectedCell();
        this.emitAction(e);
        break;
    }
  }

  destroyCmp() {
    this.pageElements = null;
    this.removeGridBodyAll();
    this.renderedBodyComponentMetaMap = null;
  }
}
