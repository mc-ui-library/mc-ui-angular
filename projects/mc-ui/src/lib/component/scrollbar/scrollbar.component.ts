import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  BaseComponent
} from './../base.component';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

// Wrapping PerfectScrollbar for customizing it, easy to use or maybe replace it with the better third party scrollbar component in the future.

@Component({
  selector: 'mc-scrollbar',
  styleUrls: ['scrollbar.component.scss'],
  templateUrl: './scrollbar.component.html'
})

export class ScrollbarComponent extends BaseComponent {

  @ViewChild(PerfectScrollbarComponent) scrollBarCmp: PerfectScrollbarComponent;

  @Input() config: PerfectScrollbarConfigInterface;

  // You can add more events from ps
  @Output() scrollY: EventEmitter < any > = new EventEmitter();
  @Output() scrollYEnd: EventEmitter < any > = new EventEmitter();

  constructor(protected er: ElementRef) {
    super(er);
  }

  // You can add more methods from ps
  scrollToTop() {
    this.scrollBarCmp.directiveRef.scrollToTop();
  }

  scrollToBottom() {
    this.scrollBarCmp.directiveRef.scrollToBottom();
  }

  onScrollY(e: any) {
    this.scrollY.emit(e);
  }

  onScrollYEnd(e: any) {
    this.scrollYEnd.emit(e);
  }
}
