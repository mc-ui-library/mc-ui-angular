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
  EventEmitter
} from '@angular/core';
import { ScrollData } from '../model';

export class InfiniteScrollServerComponent extends BaseComponent {

  private _data: ScrollData;

  private neededDataIndex = -1;
  private neededPageIndex = 1;
  private page1Indexes = {
    start: 0,
    end: 0
  };
  private page2Indexes = {
    start: 0,
    end: 0
  };

  page1Data;
  page2Data;
  rowCount;
  isLoading = false;

  @Input() idField = 'id';
  @Input() rowHeight = 30;
  @Input()
  set data(value: ScrollData) {
    if (value) {
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
      this.rowCount = this._data.rowCount;
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
  @Output() action: EventEmitter < any > = new EventEmitter();

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  updateData(indexes, pageIndex) {
    const start = indexes.start;
    const end = indexes.end;
    if (!this.data.rows[start]) {
      this.neededPageIndex = pageIndex;
      // skip the same request.
      if (this.neededDataIndex !== start) {
        this.isLoading = true;
        this.neededDataIndex = start;
        this.needData.emit({
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

  onUpdatePage(e: any) {
    if (this.page1Indexes.start !== e.page1StartIndex || this.page1Indexes.end !== e.page1EndIndex) {
      this.page1Indexes.start = e.page1StartIndex;
      this.page1Indexes.end = e.page1EndIndex;
      this.updateData(this.page1Indexes, 1);
    }
    if (this.page2Indexes.start !== e.page2StartIndex || this.page2Indexes.end !== e.page2EndIndex) {
      this.page2Indexes.start = e.page2StartIndex;
      this.page2Indexes.end = e.page2EndIndex;
      this.updateData(this.page2Indexes, 2);
    }
  }

  onAction(e) {
    this.action.emit(e);
  }
}
