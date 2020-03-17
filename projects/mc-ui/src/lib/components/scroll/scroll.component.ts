import { ScrollbarComponent } from './../scrollbar/scrollbar.component';
import { BaseComponent } from '../base.component';
import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { isEmpty, debounce } from './../../utils/utils';
import {
  ScrollConfig,
  ScrollAction,
  ScrollPage,
  ScrollActionEvent
} from '../../models';
import { applyIf, copy } from '../../utils/data-utils';

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
  rowCount?: number;
}

@Component({
  selector: 'mc-scroll',
  styleUrls: ['scroll.component.scss'],
  templateUrl: './scroll.component.html'
})
export class ScrollComponent extends BaseComponent {
  private pages: Array<ScrollPage>;
  private currentPageIndexes = new Set<number>();
  private scrollTop = 0;
  private oldScrollTop = -1;
  private ticking = false;
  private debounceUpdatePages = debounce(this.updatePages, 100, this);

  _config: ScrollConfig = {
    loadingText: 'loading...',
    emptyText: 'No Data',
    rowHeight: 35,
    isLoading: false,
    displayLoader: true
  };

  state: State = {
    contentHeight: 0,
    page1Top: 0,
    page2Top: 0,
    page1Tpl: null,
    page2Tpl: null,
    rowHeight: 0,
    loadingText: '',
    emptyText: '',
    displayLoader: false,
    isLoading: false,
    rowCount: 0
  };

  @ViewChild(ScrollbarComponent) scrollBarCmp: ScrollbarComponent;

  constructor(protected er: ElementRef) {
    super(er);
  }

  afterRenderCmp() {
    this.updatePages();
  }

  setState(config: ScrollConfig) {
    const rowCount = config.rowCount;
    if (!isEmpty(rowCount)) {
      const state = applyIf(this.state, config);
      const contentHeight = this.getContentHeight(config);
      this.pages = this.getPages(config);
      this.state = copy(state, { contentHeight });
      if (this.rendered) {
        this.updatePages();
      }
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
    // this is for the dynamic page height. e.g) a row can be a accordion container.
    let remainRowCount = config.rowCount;
    const rowHeight = config.rowHeight;
    const pageRowCount = this.getPageRowCount(config);
    const pages: Array<ScrollPage> = [];
    let startRowIndex = -1;
    let endRowIndex = 0;
    let top = 0;
    let currentRowCount;
    let pageContainerIndex = 0;
    let index = 0;
    while (remainRowCount > 0) {
      const pageHeight = (endRowIndex - (startRowIndex + 1)) * rowHeight;
      top += pageHeight;
      const bottom = top + pageHeight;
      startRowIndex = endRowIndex;
      currentRowCount =
        pageRowCount > remainRowCount ? remainRowCount : pageRowCount;
      endRowIndex = startRowIndex + currentRowCount - 1;
      pages.push({
        startRowIndex,
        endRowIndex,
        top,
        bottom,
        pageContainerIndex,
        index
      });
      remainRowCount -= currentRowCount;
      pageContainerIndex = pageContainerIndex === 0 ? 1 : 0;
      index++;
    }
    return pages;
  }

  hasEnoughSpaceToDisplay() {
    return this.el.offsetHeight > this.config.rowHeight;
  }

  isScrollDown() {
    return this.oldScrollTop < this.scrollTop;
  }

  getCurrentPageIndexes(): Set<number> {
    // this can be expensive, so we need to use "debounce" for scrolling.
    const isScrollDown = this.isScrollDown();
    const scrollTop = this.scrollTop;
    const containerHeight = this.el.offsetHeight;
    const pageIndex = this.pages.findIndex(page => {
      if (isScrollDown) {
        return page.top > scrollTop;
      } else {
        return page.bottom > scrollTop + containerHeight;
      }
    });
    const nextPageIndex = isScrollDown ? pageIndex + 1 : pageIndex - 1;
    const pageIndexes = new Set<number>();
    pageIndexes.add(pageIndex);
    if (nextPageIndex >= 0 && nextPageIndex < this.pages.length) {
      pageIndexes.add(nextPageIndex);
    }
    return pageIndexes;
  }

  addPageHeight(pageIndex: number, height: number) {
    // this for the expanded row like the accordion row. This is called from outside.
    const pagesLength = this.pages.length;
    this.pages[pageIndex].bottom += height;
    for (let i = pageIndex + 1; i < pagesLength; i++) {
      this.pages[i].top += height;
    }
    const contentHeight = this.state.contentHeight + height;
    this.state = applyIf(this.state, { contentHeight });
  }

  updatePages() {
    if (this.hasEnoughSpaceToDisplay()) {
      console.error(
        `ScrollComponent: it doesn't enough space to scroll the content`
      );
      return;
    }
    const pageIndexes = this.getCurrentPageIndexes();
    const newPageIndexes = [...pageIndexes].filter(pageIndex =>
      this.currentPageIndexes.has(pageIndex)
    );
    if (newPageIndexes.length > 0) {
      const pages: Array<ScrollPage> = newPageIndexes.map(i => this.pages[i]);
      // update page
      const action: ScrollActionEvent = {
        target: this,
        action: ScrollAction.UPDATE_PAGES,
        pages
      };
      this.action.emit(action);
    }
    this.currentPageIndexes = pageIndexes;
    this.oldScrollTop = this.scrollTop;
  }

  onScroll(e: MouseEvent) {
    const el = e.target as HTMLElement;
    this.scrollTop = el.scrollTop;
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.debounceUpdatePages();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }
}
