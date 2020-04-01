import { ScrollbarAction, ScrollbarActionEvent, ExtraHeightPage, ComponentTheme } from './../../shared.models';
import { ScrollbarComponent } from './../scrollbar/scrollbar.component';
import { BaseComponent } from '../base.component';
import { Component, ElementRef, ViewChild, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { ScrollConfig, ScrollAction, ScrollPage, ScrollActionEvent } from '../../shared.models';
import { isEmpty } from './../../utils/utils';

// it has only one extra height page container and it will be controlled by the parent component.

interface State {
  pages: Array<ScrollPage>;
  tpl?: TemplateRef<any>;
  rowHeight?: number;
  loadingText?: string;
  emptyText?: string;
  displayLoader?: boolean;
  rowCount?: number;
  isLoading?: boolean;
}

@Component({
  selector: 'mc-scroll',
  styleUrls: ['scroll.component.scss'],
  templateUrl: './scroll.component.html'
})
export class ScrollComponent extends BaseComponent {
  private pageElements: Array<HTMLElement>;
  private pageRowCount: number;
  private currentPageIndexes: Array<number> = [];
  private scrollTop = 0;
  private oldScrollTop = 0;
  private ticking = false;
  private containerHeight: number;

  private _rowCount: number;

  Theme = ComponentTheme;

  defaultConfig: ScrollConfig = {
    loadingText: 'loading...',
    emptyText: 'No Data',
    rowHeight: 35,
    displayLoader: true,
    minPageRowCount: 5
  };

  _config: ScrollConfig;

  defaultState: State = {
    tpl: null,
    pages: [],
    rowHeight: 0,
    loadingText: '',
    emptyText: '',
    displayLoader: false,
    rowCount: null,
    isLoading: true
  };

  state: State;

  @ViewChild(ScrollbarComponent) scrollBarCmp: ScrollbarComponent;

  @Input()
  set rowCount(rowCount: number) {
    if (!isEmpty(rowCount)) {
      // change row count and resize height
      this._rowCount = rowCount;
      const pages = this.initPages();
      this.setState({ pages, rowCount });
      if (this.rendered) {
        // need to wait to render the page elements by state.pages
        setTimeout(() => this.updatePages());
      }
    }
  }
  get rowCount() {
    return this._rowCount;
  }

  @Input()
  set isLoading(isLoading: boolean) {
    if (!isEmpty(isLoading)) {
      this.setState({ isLoading });
    }
  }

  @Output() action = new EventEmitter<ScrollActionEvent>();

  constructor(protected er: ElementRef) {
    super(er);
  }

  afterRenderCmp() {
    this.pageRowCount = this.getPageRowCount(this._config);
    if (isEmpty(this.rowCount)) {
      this.requestRowCount();
    } else {
      this.updatePages();
    }
  }

  applyState(config: ScrollConfig) {
    this.rowCount = config.rowCount;
  }

  initPages() {
    this.scrollTop = 0;
    this.oldScrollTop = 0;
    this.pageElements = null;
    this.currentPageIndexes = [];
    return this.getPages(this._config);
  }

  requestRowCount() {
    const actionEvent: ScrollActionEvent = {
      target: this,
      action: ScrollAction.GET_ROW_COUNT,
      pageRowCount: this.pageRowCount
    };
    this.action.emit(actionEvent);
  }

  getPageElements() {
    if (this.pageElements) {
      return this.pageElements;
    }
    const el: HTMLElement = this.el.querySelector('.scroll--content');
    this.pageElements = Array.from(el.children) as Array<HTMLElement>;
    return this.pageElements;
  }

  getPageRowCount(config: ScrollConfig) {
    if (this.pageRowCount) {
      return this.pageRowCount;
    }
    const BUFFER = 1.5;
    this.containerHeight = this.el.offsetHeight;
    const pageRowCount = Math.floor((this.containerHeight / config.rowHeight) * BUFFER);
    return pageRowCount < config.minPageRowCount ? config.minPageRowCount : pageRowCount;
  }

  getPages(config: ScrollConfig) {
    let remainRowCount = this.rowCount;
    const rowHeight = config.rowHeight;
    const pageRowCount = this.getPageRowCount(config);
    const pages: Array<ScrollPage> = [];
    let startRowIndex = -1;
    let endRowIndex = -1;
    let currentRowCount: number;
    let index = 0;
    let height = 0;
    let top = 0;
    while (remainRowCount > 0) {
      startRowIndex = endRowIndex + 1;
      currentRowCount = pageRowCount > remainRowCount ? remainRowCount : pageRowCount;
      endRowIndex = startRowIndex + currentRowCount - 1;
      height = currentRowCount * rowHeight;
      pages.push({
        top,
        startRowIndex,
        endRowIndex,
        height,
        index,
        extraHeight: 0
      });
      remainRowCount -= currentRowCount;
      top += height;
      index++;
    }
    this.pageRowCount = pageRowCount;
    return pages;
  }

  getCurrentPageIndexes() {
    const pageElements = this.getPageElements();
    const oldScrollTop = this.oldScrollTop;
    const scrollTop = this.scrollTop;
    const isDown = oldScrollTop <= scrollTop;
    const currentPageIndexes: Array<number> = [];
    const containerHeight = this.el.offsetHeight;
    const pageCount = pageElements.length;
    let prevPagesHeightSum = 0;
    // down, prev pages height sum < scroll top current page + 1 page
    // up, scroll top + container height <= page bottom (height) => page - 1
    pageElements.some((el, i) => {
      const pageHeight = el.offsetHeight;
      if (isDown) {
        if (prevPagesHeightSum <= scrollTop && scrollTop < prevPagesHeightSum + pageHeight) {
          currentPageIndexes.push(i);
          if (i + 1 < pageCount) {
            currentPageIndexes.push(i + 1);
          } else {
            if (i - 1 > 0) {
              currentPageIndexes.unshift(i - 1);
            }
          }
          return true;
        }
      } else {
        if (
          scrollTop + containerHeight <= prevPagesHeightSum + pageHeight &&
          prevPagesHeightSum < scrollTop + containerHeight
        ) {
          currentPageIndexes.push(i);
          if (i - 1 >= 0) {
            currentPageIndexes.unshift(i - 1);
          } else {
            if (i + 1 < pageCount) {
              currentPageIndexes.push(i + 1);
            }
          }
          return true;
        }
      }
      prevPagesHeightSum += pageHeight;
      return false;
    });
    this.oldScrollTop = scrollTop;
    return currentPageIndexes;
  }

  getPageHeight() {
    return this.pageRowCount * this._config.rowHeight;
  }

  getPageIndexByRowIndex(rowIndex: number) {
    return Math.floor(rowIndex / this.pageRowCount);
  }

  getApproxPageIndex(scrollTop: number) {
    // some pages can have the extra page height
    const pageHeight = this.getPageHeight();
    return Math.floor(scrollTop / pageHeight);
  }

  updateExtraHeight(extraHeightPages: Array<ExtraHeightPage>) {
    const pages = this.state.pages.concat();
    extraHeightPages.forEach(extraHeightPage => {
      pages[extraHeightPage.pageIndex].extraHeight = extraHeightPage.extraHeight;
    });
    this.setState(pages);
  }

  getScrollTopByRowIndex(rowIndex: number) {
    let scrollTop = 0;
    this.state.pages.some(page => {
      if (page.startRowIndex <= rowIndex && page.endRowIndex >= rowIndex) {
        scrollTop += (rowIndex - page.startRowIndex + 1) * this.state.rowHeight;
        return true;
      } else {
        scrollTop += page.height;
        return false;
      }
    });
    // move to the top of the row
    return scrollTop - this.state.rowHeight;
  }

  hasEnoughSpaceToDisplay() {
    return this.el.offsetHeight >= this._config.rowHeight;
  }

  hasDifferentPage(pageIndexes: Array<number>) {
    // the page indexes are ordered by number;
    const currentPageIndexes = this.currentPageIndexes;
    if (currentPageIndexes.length < pageIndexes.length) {
      return true;
    }
    return pageIndexes.some(pageIndex => !currentPageIndexes.includes(pageIndex));
  }

  updatePages() {
    if (!this.hasEnoughSpaceToDisplay()) {
      console.warn(`ScrollComponent: it doesn't enough space to scroll the content`);
      return;
    }
    const currentPageIndexes = this.getCurrentPageIndexes();
    // console.warn(this.currentPageIndexes, currentPageIndexes);
    if (this.hasDifferentPage(currentPageIndexes)) {
      this.currentPageIndexes = currentPageIndexes;
      const action: ScrollActionEvent = {
        target: this,
        action: ScrollAction.UPDATE_PAGES,
        pages: this.state.pages,
        pageElements: this.getPageElements(),
        currentPageIndexes: this.currentPageIndexes,
        pageRowCount: this.pageRowCount
      };
      this.action.emit(action);
    }
  }

  scrollByRowIndex(rowIndex: number) {
    const scrollTop = this.getScrollTopByRowIndex(rowIndex);
    this.scrollBarCmp.scrollToY(scrollTop);
  }

  onScrollAction(e: ScrollbarActionEvent) {
    switch (e.action) {
      case ScrollbarAction.SCROLL_Y:
        const el = e.event.target as HTMLElement;
        this.scrollTop = el.scrollTop;
        if (!this.ticking) {
          requestAnimationFrame(() => {
            // don't use debounce since sometimes it renders incorrectly.
            this.updatePages();
            this.ticking = false;
          });
          this.ticking = true;
        }
        break;
    }
  }
}
