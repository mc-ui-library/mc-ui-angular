import { ScrollbarActionEvent } from './../../shared.models';
import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from './../base.component';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ScrollbarConfig, ScrollbarAction } from '../../shared.models';

// Wrapping Third party components for providing encapsulated API and styles etc.
// They can be replaced with a new good third party components in the future, but we can still use the exsiting APIs.
@Component({
  selector: 'mc-scrollbar',
  styleUrls: ['scrollbar.component.scss'],
  templateUrl: './scrollbar.component.html'
})
export class ScrollbarComponent extends BaseComponent {
  defaultConfig: ScrollbarConfig = {
    suppressScrollX: true
  };

  _config: ScrollbarConfig;

  defaultState: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };

  state: PerfectScrollbarConfigInterface;

  @ViewChild(PerfectScrollbarComponent) scrollBarCmp: PerfectScrollbarComponent;

  @Output() action = new EventEmitter<ScrollbarActionEvent>();

  constructor(protected er: ElementRef) {
    super(er);
  }

  scrollToTop() {
    this.scrollBarCmp.directiveRef.scrollToTop();
  }

  scrollToBottom() {
    this.scrollBarCmp.directiveRef.scrollToBottom();
  }

  scrollToElement(query: string, offset: number = null) {
    this.scrollBarCmp.directiveRef.scrollToElement(query, offset);
  }

  scrollToY(y: number) {
    this.scrollBarCmp.directiveRef.scrollToY(y);
  }

  emitActionEvent(action: ScrollbarAction, event: any) {
    const actionEvent: ScrollbarActionEvent = {
      action,
      target: this,
      event
    };
    this.action.emit(actionEvent);
  }

  onScrollY(e: any) {
    this.emitActionEvent(ScrollbarAction.SCROLL_Y, e);
  }

  onScrollYEnd(e: any) {
    this.emitActionEvent(ScrollbarAction.SCROLL_Y_END, e);
  }
}
