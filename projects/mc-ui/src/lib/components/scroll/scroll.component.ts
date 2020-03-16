import { ScrollbarComponent } from './../scrollbar/scrollbar.component';
import {
  BaseComponent
} from '../base.component';
import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { isEmpty } from './../../utils/utils';
import { ScrollConfig } from '../../models';
import { applyIf } from '../../utils/data-utils';

interface State {
  contentHeight?: number;
  page1Top?: number;
  page2Top?: number;
  page1Tpl?: any;
  page2Tpl?: any;
  rowHeight?: number;
  loadingText?: string;
  emptyText?: string;
  displayLoader?: boolean;
  isLoading?: boolean;
}

interface Page {
  startRowIndex: number;
  endRowIndex: number;
  top: number;
}

@Component({
  selector: 'mc-scroll',
  styleUrls: ['scroll.component.scss'],
  templateUrl: './scroll.component.html'
})

export class ScrollComponent extends BaseComponent {

  _config: ScrollConfig = {
    loadingText: 'loading...',
    emptyText: 'No Data',
    rowHeight: 35,
    isLoading: false,
    displayLoader: true
  };

  state: State = {};

  @ViewChild(ScrollbarComponent) scrollBarCmp: ScrollbarComponent;







  private scrollTop = 0;
  private oldScrollTop = -1;
  private page1Index = -2;
  private page2Index = -1;
  private _rowCount: number; // for calculating the height
  private initializing = false;
  private ticking = false;

  @Input()
  set rowCount(value: number) {
    if (!isEmpty(value)) {
      this._rowCount = value;
      // init value
      this.init();
    }
  }
  get rowCount() {
    return this._rowCount;
  }

  constructor(protected er: ElementRef) {
    super(er);
  }

  setState(config: ScrollConfig) {
    const rowCount = config.rowCount;
    if (!isEmpty(rowCount)) {
      const state = applyIf(this.state, config);
      const rowHeight = config.rowHeight;
      const contentHeight = this.getContentHeight(config);
      const pages = this.getPages(config);
    }
  }

  getContentHeight(config: ScrollConfig) {
    return config.rowCount * config.rowHeight;
  }

  getPageRowCount(config: ScrollConfig) {
    const BUFFER = 1.5;
    return Math.round(this.el.offsetHeight / config.rowHeight) * BUFFER;
  }

  getPages(config: ScrollConfig) {
    let remainRowCount = config.rowCount;
    const rowHeight = config.rowHeight;
    const pageRowCount = this.getPageRowCount(config);
    const pages: Array<Page> = [];
    let startRowIndex = -1;
    let endRowIndex = 0;
    let top = 0;
    let currentRowCount;
    while (remainRowCount > 0) {
      top += (endRowIndex - (startRowIndex + 1)) * rowHeight;
      startRowIndex = endRowIndex;
      currentRowCount = pageRowCount > remainRowCount ? remainRowCount : pageRowCount;
      endRowIndex = startRowIndex + currentRowCount - 1;
      pages.push({
        startRowIndex,
        endRowIndex,
        top
      });
      remainRowCount -= currentRowCount;
    }
    return pages;
  }

  initState() {
    this.state = {
      contentHeight: 0,
      page1Top: 0,
      page2Top: -1
    };
  }

  init() {
    this.initializing = true;
    this.page1Index = -2;
    this.page2Index = -1;
    this.scrollTop = 0;
    this.oldScrollTop = -1;
    this.scrollBarCmp.scrollToTop();
    this.initState();
    this.initializing = false;
  }

  updateState(refresh = false) {
    const containerHeight = this.el.clientHeight;
    const rowHeight = this.config.rowHeight;

    if (containerHeight < rowHeight) {
      console.warn('ScrollComponent: Container height should be bigger than the row height');
      return;
    }

    const scrollTop = this.scrollTop;
    const isDown = this.oldScrollTop < scrollTop;
    let rowCount = this.rowCount;
    let page1Index = this.page1Index;
    let page2Index = this.page2Index;

    const pageRowCount = Math.round((containerHeight / rowHeight) * 1.5);
    const pageHeight = pageRowCount * rowHeight;

    // Temp rowCount: When there is no rowCount, but it needs to calc the temp page size etc.
    if (isEmpty(rowCount)) {
      rowCount = pageRowCount;
    }

    const contentHeight = rowCount === 0 ? rowHeight : rowHeight * rowCount;
    const pageLastIndex = Math.floor((contentHeight - 1) / pageHeight); // -1 for if it is the same as with the pageHeight, the page can be +1.
    const nextPageIndex = isDown ? Math.ceil(scrollTop / pageHeight) : Math.floor(scrollTop / pageHeight);
    if (refresh || (nextPageIndex <= pageLastIndex && page1Index !== nextPageIndex && page2Index !== nextPageIndex)) {
      // It may not have two pages at all. keep the full logic for readability.
      if (page1Index === -2) {
        // init
        page1Index = 0;
        page2Index = 1;
      } else if (page1Index < page2Index) {
        // asc and down, move page1 to the bottom of page2 and load the next page
        // asc and up, move page2 to the top of page1 and load the next page into page2
        page1Index = isDown ? nextPageIndex : nextPageIndex + 1;
        page2Index = page1Index - 1;
      } else {
        // desc and down / up, reverse upper logic.
        page1Index = isDown ? nextPageIndex - 1 : nextPageIndex;
        page2Index = page1Index + 1;
      }

      let page1StartIndex = page1Index * pageRowCount;
      let page2StartIndex = page2Index * pageRowCount;
      let page1EndIndex = page1StartIndex + pageRowCount - 1;
      let page2EndIndex = page2StartIndex + pageRowCount - 1;

      if (page1StartIndex >= rowCount) {
        page1StartIndex = -1;
        page1EndIndex = -1;
        page1Index = -2;
      } else if (page1EndIndex >= rowCount) {
        page1EndIndex = rowCount - 1;
      }

      if (page2StartIndex >= rowCount) {
        page2StartIndex = -1;
        page2EndIndex = -1;
        page2Index = -1;
      } else if (page2EndIndex >= rowCount) {
        page2EndIndex = rowCount - 1;
      }

      const page1Top = page1StartIndex * rowHeight;
      const page2Top = page2StartIndex * rowHeight;
      this.page1Index = page1Index;
      this.page2Index = page2Index;
      // It may not have two pages.
      const state = {
        contentHeight,
        page1Top,
        page2Top
      };
      this.state = state;
      this.updatePage.emit({
        target: this,
        page1StartIndex,
        page1EndIndex,
        page2StartIndex,
        page2EndIndex,
        page1Index,
        page2Index,
        rowCount,
        pageRowCount,
        pageLastIndex,
        page1IsFirst: page1Index === 0,
        page2IsFirst: page2Index === 0,
        page1IsLast: page1Index !== -1 && page1Index === pageLastIndex,
        page2IsLast: page2Index !== -1 && page2Index === pageLastIndex,
        refresh
      });
    }
    this.oldScrollTop = scrollTop;
  }

  onScroll(e: MouseEvent) {
    const el = e.target as HTMLElement;
    this.scrollTop = el.scrollTop;
    if (!this.ticking) {
      if (this.initializing) {
        return;
      }
      requestAnimationFrame(() => {
        this.updateState();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  onScrollEnd(e: MouseEvent) {
    // when the scroll is the end, sometimes it is not updated.
    this.updateState();
  }
}
