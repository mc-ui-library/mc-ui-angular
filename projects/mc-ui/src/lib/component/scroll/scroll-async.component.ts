import {
  MCUIService
} from '../../mc-ui.service';
import {
  BaseComponent
} from '../base.component';
import {
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { ScrollData } from '../model';
import { ScrollComponent } from './scroll.component';

export class ScrollAsyncComponent extends BaseComponent {

  private _data: ScrollData;

  private neededDataIndex = -1;
  private neededPageIndex = 1;
  private page1Indexes = {
    start: -1,
    end: -1
  };
  private page2Indexes = {
    start: -1,
    end: -1
  };

  originHeight: number;

  page1Data;
  page2Data;
  rowCount;
  isLoading = false;

  page1IsFirst = false;
  page2IsFirst = false;
  page1IsLast = false;
  page2IsLast = false;

  @ViewChild('scrollCmp', { static: false }) scrollCmp: ScrollComponent;

  @Input() emptyText = 'No Data';
  @Input() idField = 'id';
  @Input() rowHeight = 45;
  @Input()
  set data(value: ScrollData) {
    // console.log('update scroll data', value);
    if (value) {
      // init page
      this.page1Indexes = { start: -1, end: -1 };
      this.page2Indexes = { start: -1, end: -1 };

      let data: ScrollData;
      if (Array.isArray(value)) {
        data = {
          action: 'initialize',
          rows: value,
          start: 0,
          rowCount: value.length
        };
      } else {
        data = value;
      }
      if (!data.columns) {
        data.columns = data.rows[0] ? Object.keys(data.rows[0]).map(key => {
          return {
            field: key
          };
        }) : null;
      }
      this._data = data;
      this.rowCount = data.rowCount;
      // after rendering, it need to update the scroll state manually whenever the data is updated since the scroll doesn't have data property.
      if (this.rendered) {
        this.updateHeight();
        // update after the rowCount is applied.
        setTimeout(() => this.scrollCmp.updateState(true));
      }
    }
  }
  get data() {
    return this._data;
  }

  @Input()
  set additionalData(value: ScrollData) {
    if (value) {
      const {
        action,
        rows,
        start,
        rowCount
      } = value;
      const currRows = this.data.rows.concat();
      if (action === 'append') {
        rows.forEach((d, i) => currRows[i + start] = d);
        this.data.rows = rows;
      } else if (action === 'insert') {
        currRows.splice(start, 0, ...rows);
        this.data.rows = currRows;
      }
      this.rowCount = rowCount;
      this.updateData(this.neededPageIndex === 1 ? this.page1Indexes : this.page2Indexes, this.neededPageIndex);
      this.isLoading = false;
    }
  }

  // there is no data, then it triggers "needData" event.
  @Output() needData: EventEmitter < any > = new EventEmitter();

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  afterInitCmp() {
    // the content height is smaller than container height, adjust container height.
    // this needs to run before rendering scroll.
    this.updateHeight();
  }

  updateData(indexes, pageIndex) {
    const start = indexes.start;
    const end = indexes.end;
    if (this.rowCount && !this.data.rows[start]) {
      this.neededPageIndex = pageIndex;
      // skip the same request.
      if (this.neededDataIndex !== start) {
        this.isLoading = true;
        this.neededDataIndex = start;
        this.needData.emit({
          target: this,
          index: this.neededDataIndex,
          action: 'append'
        }); // when tree, it needs to insert data
      }
    } else {
      const data = this.data.rows.slice(start, end + 1);
      if (pageIndex === 1) {
        this.page1Data = data;
      } else {
        this.page2Data = data;
      }
    }
  }

  updateHeight() {
    // when the items height are smaller than container height.
    const height = this.rowCount === 0 ? this.rowHeight : this.rowHeight * this.rowCount;
    if (!this.originHeight) {
      this.originHeight = this.el.clientHeight;
    }
    if (this.originHeight > height) {
      this.el.style.height = height + 'px';
    } else {
      this.el.style.height = this.originHeight + 'px';
    }
  }

  getItems() {
    return this.data.rows;
  }

  onUpdatePage(e: any) {
    if (e.page1StartIndex < 0) {
      this.page1Indexes.start = e.page1StartIndex;
      this.page1Indexes.end = e.page1EndIndex;
      this.page1Data = [];
    } else {
      if (this.page1Indexes.start !== e.page1StartIndex || this.page1Indexes.end !== e.page1EndIndex) {
        this.page1Indexes.start = e.page1StartIndex;
        this.page1Indexes.end = e.page1EndIndex;
        this.updateData(this.page1Indexes, 1);
      }
    }
    if (e.page2StartIndex < 0) {
      this.page2Indexes.start = e.page2StartIndex;
      this.page2Indexes.end = e.page2EndIndex;
      this.page2Data = [];
    } else {
      if (this.page2Indexes.start !== e.page2StartIndex || this.page2Indexes.end !== e.page2EndIndex) {
        this.page2Indexes.start = e.page2StartIndex;
        this.page2Indexes.end = e.page2EndIndex;
        this.updateData(this.page2Indexes, 2);
      }
    }
    this.page1IsLast = e.page1IsLast;
    this.page2IsLast = e.page2IsLast;
    this.page1IsFirst = e.page1IsFirst;
    this.page2IsFirst = e.page2IsFirst;
  }

  onAction(e) {
    this.action.emit(e);
  }
}
