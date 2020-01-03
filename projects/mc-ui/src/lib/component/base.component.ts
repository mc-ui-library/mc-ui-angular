import {
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  MCUIService
} from '../mc-ui.service';
import {
  Util
} from '../util/util';
import {
  Subscription
} from 'rxjs';

/**
 * Base Class for All UI Components
 */
// state for rendering
export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  private _subscriptions = [];

  rendered = false;

  // read/write rendering related members. the interface should be defineded for type checking.
  state: any;

  el: HTMLElement;
  util: Util;

  // special members that can be changed during run-time or important member. like data etc.
  // theme classes
  @Input() theme: string | string[];
  @Input()
  set subscriptions(value: Subscription) {
    if (value) {
      this._subscriptions.push(value);
    }
  }

  @Output() action: EventEmitter < any > = new EventEmitter();

  constructor(protected er: ElementRef, protected service: MCUIService) {
    this.el = this.er.nativeElement;
    this.util = this.service.util;
    this.initState();
  }

  initState() {
    // default state etc
  }

  ngOnInit() {
    this.initCmp();
  }

  ngAfterViewInit() {
    this.afterInitCmp();
    // theme should be the last class for priority
    this.applyThemeClass();
    setTimeout(() => {
      this.afterRenderCmp();
      this.rendered = true;
      this.action.emit({ target: this, action: 'rendered' });
    });
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.destroyCmp();
    this.el = null;
  }

  applyThemeClass() {
    if (this.theme) {
      const themes = !Array.isArray(this.theme) ? [this.theme] : this.theme;
      const compName = this.el.tagName.toLowerCase().split('mc-')[1];
      this.el.classList.add(...themes.map(d => compName + '-' + d));
    }
  }

  initCmp() {
    // empty
  }

  afterInitCmp() {}

  afterRenderCmp() {

  }

  // update a specific state
  setState(state: any) {
    const currState = this.util.clone(this.state);
    Object.keys(state).forEach(key => currState[key] = state[key]);
    this.state = currState;
  }

  unsubscribeAll() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  destroyCmp() {
    // to remove dom elements reference etc.
  }
}
