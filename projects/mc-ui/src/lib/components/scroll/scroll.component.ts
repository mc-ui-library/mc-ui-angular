import { ExtraHeightRow, ExtraHeightPage } from '../../mc-ui.models';
import { ScrollbarComponent } from './../scrollbar/scrollbar.component';
import { BaseComponent } from '../base.component';
import { Component, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { ScrollConfig, ScrollAction, ScrollPage, ScrollActionEvent } from '../../mc-ui.models';
import { debounce } from './../../utils/utils';

interface State {
  pages: Array<ScrollPage>;
  tpl?: TemplateRef<any>;
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
  private pageElements: Array<HTMLElement>;
  private pageRowCount: number;
  private currentPagesMap: Map<number, ScrollPage>;
  private scrollTop = 0;
  private ticking = false;
  private oldRowCount: number;
  private containerHeight: number;
  private extraHeightPagesMap: Map<number, ExtraHeightPage>;

  private debounceUpdatePages = debounce(() => this.updatePages(), 100);

  _config: ScrollConfig = {
    loadingText: 'loading...',
    emptyText: 'No Data',
    rowHeight: 35,
    isLoading: false,
    displayLoader: true,
    minPageRowCount: 20
  };

  state: State = {
    tpl: null,
    pages: [],
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

  applyState(config: ScrollConfig) {
    // change row count and resize height
    if (this.oldRowCount !== config.rowCount || this.containerHeight !== this.el.offsetHeight) {
      this.pageElements = null;
      const pages = this.getPages(config);
      this.setState({ pages });
      if (this.rendered) {
        this.updatePages();
      }
      this.oldRowCount = config.rowCount;
    }
  }

  getPageElements() {
    if (this.pageElements) {
      return this.pageElements;
    }
    const el = this.el.querySelector('.scroll--content');
    this.pageElements = Array.from(el.children) as Array<HTMLElement>;
    return this.pageElements;
  }

  getPageRowCount(config: ScrollConfig) {
    const BUFFER = 1.5;
    this.containerHeight = this.el.offsetHeight;
    const pageRowCount = Math.round(this.containerHeight / config.rowHeight) * BUFFER;
    return pageRowCount < config.minPageRowCount ? config.minPageRowCount : pageRowCount;
  }

  getPages(config: ScrollConfig) {
    let remainRowCount = config.rowCount;
    const rowHeight = config.rowHeight;
    const pageRowCount = this.getPageRowCount(config);
    const pages: Array<ScrollPage> = [];
    let startRowIndex = -1;
    let endRowIndex = 0;
    let currentRowCount: number;
    let index = 0;
    let height = 0;
    const extraHeight = 0;
    while (remainRowCount > 0) {
      startRowIndex = endRowIndex;
      currentRowCount = pageRowCount > remainRowCount ? remainRowCount : pageRowCount;
      endRowIndex = startRowIndex + currentRowCount - 1;
      height = currentRowCount * rowHeight;
      pages.push({
        startRowIndex,
        endRowIndex,
        height,
        index,
        extraHeight
      });
      remainRowCount -= currentRowCount;
      index++;
    }
    this.pageRowCount = pageRowCount;
    return pages;
  }

  getCurrentPagesMap() {
    const pageElements = this.getPageElements();
    const scrollTop = this.scrollTop;
    const pageIndex = this.getApproxPageIndex(scrollTop);
    const pageCount = pageElements.length;
    const pages = this.state.pages;
    const currentPagesMap = new Map<number, ScrollPage>();
    for (let i = pageIndex; i < pageCount; i++) {
      const box = pageElements[i].getBoundingClientRect();
      if (box.top < scrollTop) {
        currentPagesMap.set(i, pages[i]);
        i++;
        if (i < pageCount) {
          currentPagesMap.set(i, pages[i]);
        }
        break;
      }
    }
    return currentPagesMap;
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

  getScrollTopByRowIndex(rowIndex: number) {
    let scrollTop = 0;
    this.state.pages.find(page => {
      if (page.startRowIndex <= rowIndex && page.endRowIndex >= rowIndex) {
        const extraHeightPage = this.extraHeightPagesMap.get(page.index);
        const extraHeightRowsMap = extraHeightPage
          ? extraHeightPage.extraHeightRowsMap || new Map<number, ExtraHeightRow>()
          : new Map<number, ExtraHeightRow>();
        const rowHeight = this.state.rowHeight;
        for (let i = page.startRowIndex; i <= rowIndex; i++) {
          const extraHeightRow = extraHeightRowsMap.get(i) || { extraHeight: 0 };
          scrollTop += rowHeight + extraHeightRow.extraHeight;
        }
        return true;
      } else {
        scrollTop += page.height + page.extraHeight;
        return false;
      }
    });
    return scrollTop;
  }

  hasEnoughSpaceToDisplay() {
    return this.el.offsetHeight > this._config.rowHeight;
  }

  reloadPages() {
    this.pageElements = null;
    const pages = this.getPages(this._config);
    this.setState({ pages });
    const currentPagesMap = this.getCurrentPagesMap();
    const actionEvent: ScrollActionEvent = {
      target: this,
      action: ScrollAction.RELOAD_PAGES,
      pageElements: this.getPageElements(),
      currentPagesMap,
      pageRowCount: this.pageRowCount
    };
    this.action.emit(actionEvent);
    this.currentPagesMap = currentPagesMap;
  }

  updatePages() {
    if (this.hasEnoughSpaceToDisplay()) {
      console.error(`ScrollComponent: it doesn't enough space to scroll the content`);
      return;
    }
    const currentPagesMap = this.getCurrentPagesMap();
    const oldPagesMap = this.currentPagesMap;
    const addingPagesMap = new Map<number, ScrollPage>();
    const removingPagesMap = new Map<number, ScrollPage>();
    currentPagesMap.forEach((page, index) => {
      if (!oldPagesMap.has(index)) {
        addingPagesMap.set(index, page);
      } else {
        removingPagesMap.set(index, page);
      }
    });
    if (addingPagesMap.size > 0) {
      // update page
      const action: ScrollActionEvent = {
        target: this,
        action: ScrollAction.UPDATE_PAGES,
        pageElements: this.getPageElements(),
        addingPagesMap,
        removingPagesMap,
        currentPagesMap,
        pageRowCount: this.pageRowCount
      };
      this.action.emit(action);
    }
    this.currentPagesMap = currentPagesMap;
  }

  updatePagesExtraHeight(extraHeightPagesMap: Map<number, ExtraHeightPage>) {
    const pages = this.state.pages.concat();
    extraHeightPagesMap.forEach((extraHeightPage, pageIndex) => {
      const currentExtraHeightPage = this.extraHeightPagesMap.get(pageIndex) || {
        pageIndex,
        extraHeightRowsMap: new Map<number, ExtraHeightRow>()
      };
      extraHeightPage.extraHeightRowsMap.forEach((extraHeightRow, rowIndex) => {
        const currentExtraHeightRow = currentExtraHeightPage.extraHeightRowsMap.get(rowIndex) || {
          pageIndex,
          rowIndex,
          extraHeight: 0
        };
        currentExtraHeightRow.extraHeight = extraHeightRow.extraHeight;
        currentExtraHeightPage.extraHeightRowsMap.set(rowIndex, currentExtraHeightRow);
      });
      const page = pages[pageIndex];
      let extraPageHeight = 0;
      currentExtraHeightPage.extraHeightRowsMap.forEach(row => (extraPageHeight += row.extraHeight));
      page.extraHeight = extraPageHeight;
      pages[pageIndex] = page;
    });
    this.setState({ pages });
  }

  getExtraHeightPagesMap() {
    return this.extraHeightPagesMap;
  }

  scrollByRowIndex(rowIndex: number) {
    const scrollTop = this.getScrollTopByRowIndex(rowIndex);
    this.scrollBarCmp.scrollToY(scrollTop);
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
