import { ElementRef, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { getComponentNameByElement, getThemeClasses } from '../utils/dom-utils';
import { ComponentConfig } from '../models';
import { applyIf, copy } from '../utils/data-utils';

/**
 * Base Class for All UI Presentational Components
 */
// state for rendering
export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  private _subscriptions: Array<Subscription> = [];
  private appliedThemeClasses: string[];

  // default config
  _config: ComponentConfig = {};
  // state for update template
  state: any = {};

  componentName: string;
  rendered = false;
  el: HTMLElement;

  @Input()
  set config(value: any) {
    if (value) {
      this._config = copy(this._config, value);
      this.setConfig(this._config);
    }
  }
  get config() {
    return this._config;
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
    this.applyThemes(this.config.themes);
    this.afterRenderCmp();
    this.rendered = true;
    this.action.emit({ target: this, action: 'rendered' });
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.destroyCmp();
    this.el = null;
  }

  set subscriptions(value: Subscription) {
    if (value) {
      this._subscriptions.push(value);
    }
  }

  setConfig(config: any) {
    this.setThemes(config.themes);
    this.setState(config);
  }

  setState(config: any) {
    this.state = applyIf(this.state, config);
  }

  setThemes(themes: Array<string>) {
    if (themes) {
      if (this.rendered) {
        if (this.appliedThemeClasses) {
          this.el.classList.remove(...this.appliedThemeClasses);
        }
        this.applyThemes(themes);
      }
    }
  }

  applyThemes(themes: Array<string>) {
    this.beforeThemeInit();
    themes = getThemeClasses(this.componentName, themes);
    this.el.classList.add(...themes);
    this.appliedThemeClasses = themes;
    this.afterThemeInit();
  }

  beforeThemeInit() {}

  afterThemeInit() {}

  initCmp() {
    // empty
  }

  afterInitCmp() {}

  afterRenderCmp() {}

  unsubscribeAll() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  destroyCmp() {
    // to remove dom elements reference etc.
  }
}
