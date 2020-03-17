import {
  GridAction,
  ScrollData,
  SortItem,
  SortDirection,
  GridBodyData,
  GridHeaderData,
  ScrollDataAction,
  Column,
  GridNeedDataEvent
} from './../../models';
import { BaseComponent } from '../base.component';
import {
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { ScrollComponent } from './scroll.component';
import { debounceTime } from 'rxjs/operators';
import { isEmpty } from '../../utils/utils';
import { getContainerWidth } from '../../utils/dom-utils';
import { McUiService } from '../../mc-ui.service';

export class ScrollAsyncComponent extends BaseComponent {




  private _data: ScrollData;
  private _headerData: GridHeaderData = {
    columns: null,
    data: null
  };
  private page1Indexes = {
    start: -1,
    end: -1
  };
  private page2Indexes = {
    start: -1,
    end: -1
  };
  // to prevent duplicated requests
  private requestedIndexes = new Set();
  private renderedStartIndexes = {
    page1: -1,
    page2: -1
  };

  sortItem: SortItem = {
    fieldName: '',
    direction: SortDirection.ASC
  };

  originHeight: number;

  page1Data: GridBodyData;
  page2Data: GridBodyData;
  rowCount: number;
  isLoading = true;

  page1IsFirst = false;
  page2IsFirst = false;
  page1IsLast = false;
  page2IsLast = false;
  pageRowCount = 0;
  neededPageIndex = -1;
  page1Index = -1;
  page2Index = -1;

  isPage1Loading = false;
  isPage2Loading = false;

  // for resizing the window
  resizedContainerWidth: number;

  @ViewChild(ScrollComponent) scrollCmp: ScrollComponent;

  @Input() emptyText = 'No Data';
  @Input() idField = 'id';
  @Input() rowHeight = 44;
  @Input() displayLoader = true;
  @Input()
  set headerData(value: GridHeaderData) {
    if (value) {
      this._headerData = value;
      // init sort item
      this.initSortItem(value.columns);
    }
  }
  get headerData() {
    return this._headerData;
  }
  @Input()
  set data(value: ScrollData) {
    // console.log('input data', value);
    if (value) {
      const oldData = this._data || {};
      const newData = value;
      const action: ScrollDataAction = newData.action
        ? newData.action
        : newData.start
        ? ScrollDataAction.APPEND
        : ScrollDataAction.INIT;

      this.initData(action, newData, oldData);
      this.isLoading = false;
      this.emitActionLoaded();
    }
  }
  get data() {
    return this._data;
  }

  // there is no data, then it triggers "needData" event.
  @Output() needData = new EventEmitter();

  constructor(
    protected er: ElementRef,
    protected service: McUiService,
    protected cd: ChangeDetectorRef
  ) {
    super(er);
    this.subscriptions = service.windowResize
      .pipe(debounceTime(500))
      .subscribe(() => this.onResizeWindow());
  }

  afterInitCmp() {
    this.updateSize();
  }

  initData(action, newData, oldData) {
    let rowCount: number;
    let rows: any[];

    const headerData: GridHeaderData = this.headerData;
    let columns: Column[] = headerData.columns;

    // Update Data
    switch (action) {
      case ScrollDataAction.INIT:
        rows = Array.isArray(newData) ? newData : newData.rows;
        rowCount = newData.rowCount
          ? newData.rowCount
          : rows
          ? rows.length
          : null;
        if (!columns) {
          columns = rows[0]
            ? Object.keys(rows[0]).map(key => {
                return {
                  field: key
                };
              })
            : null;
          this.headerData = {
            data: headerData.data,
            columns
          };
        }
        // init page
        this.page1Indexes = { start: -1, end: -1 };
        this.page2Indexes = { start: -1, end: -1 };
        this.renderedStartIndexes = { page1: -1, page2: -1 };
        this.requestedIndexes = new Set();
        this.scrollCmp.init();
        break;
      case ScrollDataAction.RELOAD:
      case ScrollDataAction.APPEND:
        rowCount = newData.rowCount ? newData.rowCount : oldData.rowCount;
        rows = oldData.rows.concat();
        const start = newData.start;
        newData.rows.forEach((d, i) => (rows[start + i] = d));
        break;
      case ScrollDataAction.INSERT:
        // TODO
        break;
    }

    this._data = {
      rowCount,
      rows
    };
    this.rowCount = rowCount;

    // Render Pages. This can be different from the added data since the added data can be async.
    switch (action) {
      case ScrollDataAction.INIT:
        // after rendering, it need to update the scroll state manually whenever the data is updated since the scroll doesn't have data property.
        if (this.rendered) {
          this.updateSize();
        }
        break;
      // neededData is async so it needs to be reloaded all pages.
      case ScrollDataAction.APPEND:
        // skip the already rendered page
        if (
          this.page1Indexes.start !== -1 &&
          this.page1Indexes.start !== this.renderedStartIndexes.page1
        ) {
          this.updateData(this.page1Indexes, 1);
        }
        if (
          this.page2Indexes.start !== -1 &&
          this.page2Indexes.start !== this.renderedStartIndexes.page2
        ) {
          this.updateData(this.page2Indexes, 2);
        }
        break;
      case ScrollDataAction.RELOAD:
        if (this.page1Indexes.start !== -1) {
          this.updateData(this.page1Indexes, 1);
        }
        if (this.page2Indexes.start !== -1) {
          this.updateData(this.page2Indexes, 2);
        }
        break;
      case ScrollDataAction.INSERT:
        // TODO
        break;
    }
  }

  initSortItem(columns: Column[]) {
    if (columns) {
      const sortCol = columns.find(col => !!col.sortDirection);
      if (sortCol) {
        this.sortItem = {
          fieldName: sortCol.field,
          direction: sortCol.sortDirection
        };
      }
    }
  }

  updateData(indexes, pageContainerIndex) {
    // console.log(indexes, pageContainerIndex);
    const start = indexes.start;
    const end = indexes.end;
    if (isEmpty(this.rowCount) || (this.rowCount && !this.data.rows[start])) {
      // TODO: There is no data for the page, but it can have the old data, so it should display a loading message instead of the old data.
      if (pageContainerIndex === 1) {
        this.isPage1Loading = true;
      } else {
        this.isPage2Loading = true;
      }
      // skip the same request.
      if (!this.requestedIndexes.has(start)) {
        // console.log('needData', start);
        this.isLoading = true;
        this.requestedIndexes.add(start);
        this.emitNeedData(
          start === 0 ? ScrollDataAction.INIT : ScrollDataAction.APPEND,
          start
        );
      }
    } else {
      const data = this.data.rows.slice(start, end + 1);
      const columns = this.headerData.columns;
      // console.log(indexes, pageContainerIndex, data);
      if (pageContainerIndex === 1) {
        // memo for skipping re-render the same page
        this.renderedStartIndexes.page1 = start;
        this.page1Data = {
          start,
          columns,
          data
        };
        this.isPage1Loading = false;
      } else {
        // memo for skipping re-render the same page
        this.renderedStartIndexes.page2 = start;
        this.page2Data = {
          start,
          columns,
          data
        };
        this.isPage2Loading = false;
      }
      // page1Data, page2Data was assigned, but sometimes grid-body.component data is not updated. It should've was updated.
      this.cd.detectChanges();
    }
  }

  emitNeedData(action: ScrollDataAction, start: number) {
    const needDataEvent: GridNeedDataEvent = {
      target: this,
      index: start,
      pageIndex: this.neededPageIndex,
      pageRowCount: this.pageRowCount,
      page1Index: this.page1Index,
      page2Index: this.page2Index,
      action,
      sort: this.sortItem
    };
    this.needData.emit(needDataEvent); // when tree, it needs to insert data
  }

  emitActionLoaded() {
    this.action.emit({ target: this, action: GridAction.LOADED });
  }

  updateSize() {
    this.resizedContainerWidth = getContainerWidth(this.el);
  }

  getItems() {
    return this.data.rows;
  }

  onResizeWindow() {
    this.updateSize();
  }

  onUpdatePage(e: any) {
    this.pageRowCount = e.pageRowCount;
    if (e.page1StartIndex < 0) {
      this.page1Indexes.start = e.page1StartIndex;
      this.page1Indexes.end = e.page1EndIndex;
      this.page1Data = {
        columns: this.headerData.columns,
        data: []
      };
    } else {
      if (
        this.page1Indexes.start !== e.page1StartIndex ||
        this.page1Indexes.end !== e.page1EndIndex
      ) {
        this.page1Indexes.start = e.page1StartIndex;
        this.page1Indexes.end = e.page1EndIndex;
        this.neededPageIndex = e.page1Index;
        this.updateData(this.page1Indexes, 1);
      }
    }
    if (e.page2StartIndex < 0) {
      this.page2Indexes.start = e.page2StartIndex;
      this.page2Indexes.end = e.page2EndIndex;
      this.page2Data = {
        columns: this.headerData.columns,
        data: []
      };
    } else {
      if (
        this.page2Indexes.start !== e.page2StartIndex ||
        this.page2Indexes.end !== e.page2EndIndex
      ) {
        this.page2Indexes.start = e.page2StartIndex;
        this.page2Indexes.end = e.page2EndIndex;
        this.neededPageIndex = e.page2Index;
        this.updateData(this.page2Indexes, 2);
      }
    }
    this.page1IsLast = e.page1IsLast;
    this.page2IsLast = e.page2IsLast;
    this.page1IsFirst = e.page1IsFirst;
    this.page2IsFirst = e.page2IsFirst;
    this.page1Index = e.page1Index;
    this.page2Index = e.page2Index;
  }

  onAction(e) {
    this.action.emit(e);
  }
}
