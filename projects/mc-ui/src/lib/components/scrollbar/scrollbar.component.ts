import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  BaseComponent
} from './../base.component';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ScrollbarConfig } from '../../models';

// Wrapping Third party components for providing encapsulated API and styles etc.
// They can be replaced with a new good third party components in the future, but we can still use the exsiting APIs.
@Component({
  selector: 'mc-scrollbar',
  styleUrls: ['scrollbar.component.scss'],
  templateUrl: './scrollbar.component.html'
})

export class ScrollbarComponent extends BaseComponent {

  _config: ScrollbarConfig = {
    suppressScrollX: true
  };

  state: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent) scrollBarCmp: PerfectScrollbarComponent;

  @Output() scrollY: EventEmitter < any > = new EventEmitter();
  @Output() scrollYEnd: EventEmitter < any > = new EventEmitter();

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

  onScrollY(e: any) {
    this.scrollY.emit(e);
  }

  onScrollYEnd(e: any) {
    this.scrollYEnd.emit(e);
  }
}
