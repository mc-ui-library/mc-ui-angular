import {
  ViewContainerRef,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import {
  Subscription
} from 'rxjs';

export class AppBaseComponent implements OnInit, OnDestroy, AfterViewInit {

  el: HTMLElement;

  private _subscriptions = [];

  @Input()
  set subscriptions(value: Subscription) {
    if (value) {
      this._subscriptions.push(value);
    }
  }

  /**
   * Base class for all UI page components
   * @param er many times we needs to access container element
   */
  constructor(
    protected er: ViewContainerRef
  ) {
    this.el = er.element.nativeElement;
  }

  ngOnInit() {
    this.initCmp();
  }

  ngAfterViewInit() {
    this.afterInitCmp();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.destroyCmp();
  }

  initCmp() {
    // empty
  }

  afterInitCmp() {
    // for Input() properties that are initialized after initCmp. e.g) "config" property for entryComponents
  }

  unsubscribeAll() {
    this._subscriptions.forEach(s => s.unsubscribe());
    this._subscriptions = [];
  }

  destroyCmp() {
    // to remove dom elements reference etc.
  }
}
