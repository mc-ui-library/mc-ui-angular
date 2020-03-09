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
  Subscription
} from 'rxjs';
import { getThemeClasses, getComponentNameByElement } from '../utils/dom-utils';

/**
 * Base Class for All UI Components
 */
// state for rendering
export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  private _subscriptions = [];
  private _theme: string[];
  private themeClasses: string[];

  componentName: string;
  rendered = false;

  el: HTMLElement;

  // special members that can be changed during run-time or important member. like data, additionalData etc.
  // theme classes
  @Input()
  set theme(value: string | string[]) {
    if (value) {
      this._theme = Array.isArray(value) ? value : [value];
      // theme should be the last class for priority
      if (this.rendered) {
        if (this.themeClasses) {
          // remove previous themes
          this.el.classList.remove(...this.themeClasses);
        }
        this.applyThemeClass();
      }
    }
  }
  get theme() {
    return this._theme;
  }
  @Input()
  set subscriptions(value: Subscription) {
    if (value) {
      this._subscriptions.push(value);
    }
  }

  @Output() action: EventEmitter<any> = new EventEmitter();

  constructor(protected er: ElementRef) {
    this.el = this.er.nativeElement;
    this.componentName = getComponentNameByElement(this.el);
  }

  ngOnInit() {
    this.initCmp();
  }

  ngAfterViewInit() {
    this.afterInitCmp();
    this.applyThemeClass();
    this.afterRenderCmp();
    this.rendered = true;
    this.action.emit({ target: this, action: 'rendered' });
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.destroyCmp();
    this.el = null;
  }

  applyThemeClass() {
    this.beforeThemeInit();
    if (this.theme) {
      const themes = getThemeClasses(this.componentName, this.theme);
      this.el.classList.add(...themes);
      this.themeClasses = themes;
    }
    this.afterThemeInit();
  }

  beforeThemeInit() { }

  afterThemeInit() { }

  initCmp() {
    // empty
  }

  afterInitCmp() { }

  afterRenderCmp() { }

  getBody() {
    return document.body;
  }

  unsubscribeAll() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  destroyCmp() {
    // to remove dom elements reference etc.
  }
}
