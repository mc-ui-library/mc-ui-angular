import { ElementRef, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { getComponentNameByElement, getThemeClasses } from '../utils/dom-utils';
import { ComponentConfig, ComponentAction, ComponentActionEvent } from '../mc-ui.models';
import { setStateIf, setState } from '../utils/data-utils';

export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  // internal state
  private _subscriptions: Array<Subscription> = [];
  private appliedThemeClasses: string[];

  // default config, readonly
  _config: ComponentConfig = {};

  // default state for updating template (rendering)
  state: any = {};
  componentName: string;
  initialized = false;
  rendered = false;
  el: HTMLElement;

  @Input()
  set config(value: any) {
    if (value) {
      this._config = setState(this._config, value);
      this.init(this._config);
    }
  }
  get config() {
    return this._config;
  }

  // TODO: define action type for children
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
    const action: ComponentActionEvent = {
      target: this,
      action: ComponentAction.RENDERED
    };
    this.action.emit(action);
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.destroyCmp();
    this.el = null;
    this._config = null;
    this.state = null;
  }

  set subscriptions(value: Subscription) {
    if (value) {
      this._subscriptions.push(value);
    }
  }

  init(config: any) {
    if (!this.initialized) {
      this.initThemes(config.themes);
    }
    this.applyConfig(config);
    this.applyConfigToState(config);
    this.applyState(config);
    this.initialized = true;
  }

  applyConfig(config: any) {}

  applyConfigToState(config: any) {
    this.state = setStateIf(this.state, config);
  }

  applyState(config: any) {}

  setState(state: any) {
    this.state = setState(this.state, state);
  }

  initThemes(themes: Array<string>) {
    if (themes) {
      this.applyThemes(themes);
    }
  }

  applyThemes(themes: Array<string>) {
    if (this.rendered) {
      if (this.appliedThemeClasses) {
        this.el.classList.remove(...this.appliedThemeClasses);
      }
    }
    this.beforeThemeInit();
    themes = getThemeClasses(this.componentName, themes);
    this.el.classList.add(...themes);
    this.appliedThemeClasses = themes;
    this.afterThemeInit();
  }

  beforeThemeInit() {}

  afterThemeInit() {}

  initCmp() {}

  afterInitCmp() {}

  afterRenderCmp() {}

  unsubscribeAll() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  destroyCmp() {
    // to remove dom elements reference etc.
  }
}
