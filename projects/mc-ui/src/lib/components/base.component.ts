import {
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import { getComponentNameByElement, getThemeClasses } from '../utils/dom-utils';
import {
  ComponentConfig,
  ComponentAction,
  ComponentActionEvent
} from '../shared.models';
import { setStateIf, setState } from '../utils/data-utils';

/**
 * Angular Change Detection
 * https://www.mokkapps.de/blog/the-last-guide-for-angular-change-detection-you-will-ever-need/
 * It checks all the values or property of a value that are used by the component template.
 * If a property of an object is used for the template, it checks only the property value even if the obejct is changed.
 * The object is changed, but the property value of the object that is used by the template is not changed, it will not trigger the change detection.
 * If you don't want to check the property that is used by the template, you can use "changeDetection: ChangeDetectionStrategy.OnPush".
 * If you change the property of an object that is used by the template. The detector only check the object is changed or not when using OnPush.
 * If you use "OnPush", you may need immutable.js library for immutable object.
 */

/**
 * Design Concept
 * - "config" property for static configuration. It helps to reduce one time properties.
 * - You can add other properties for change detection for updating the component template,
 *    but the default values are from the "config" after that you can update the property for the change detection.
 * - it has only one Output that is an "action" event for easy to type the events and management.
 * - The "state" variable for managing the properties that are used for the template.
 *    It is mutable since the Angular default change detection strategy supports to check the properties also.
 *    If you use the OnPush strategy, we don't use state property for triggering the change detection.
 *    If you want to mutate the "state" for updating the template after setting the "config", you can use a property for that.
 */
export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  // internal state
  private _subscriptions: Array<Subscription> = [];
  private appliedThemeClasses: string[];

  // you can add default config properties.
  defaultConfig: ComponentConfig = {};

  _config: ComponentConfig;

  // you can add default state properties for the template. state has all the properties that are used by the template
  defaultState: any = {};

  // if you want to update the template after rendered the component, you can use a specific "Input" property for mutating the state property.
  state: any;
  componentName: string;
  initialized = false;
  rendered = false;
  el: HTMLElement;

  @Input()
  set config(config: any) {
    if (config) {
      // copy the default config values and update config.
      if (!this._config) {
        this._config = setState(this.defaultConfig, config);
      } else {
        this._config = setState(this._config, config);
      }
      this.init(this._config);
    }
  }
  get config() {
    return this._config;
  }

  @Output() action = new EventEmitter<any>();

  constructor(protected er: ElementRef) {
    this.el = this.er.nativeElement;
    this.componentName = getComponentNameByElement(this.el);
  }

  ngOnInit() {
    this.initCmp();
  }

  ngAfterViewInit() {
    this.afterInitCmp();
    if (this._config && this._config.themes) {
      this.applyThemes(this._config.themes);
    }
    this.afterRenderCmp();
    this.rendered = true;
    this.emitRenderedActionEvent();
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
    this.initThemes(config.themes);
    this.applyConfig(config);
    this.applyConfigToState(config);
    this.applyState(config);
    this.initialized = true;
  }

  applyConfig(config: any) {
    // for mutating the config before using that for the state. after this, this._config is readonly value.
  }

  applyConfigToState(config: any) {
    // copy some config values that are used for the template.
    if (!this.state) {
      this.state = setStateIf(this.defaultState, config);
    } else {
      this.state = setStateIf(this.state, config);
    }
  }

  applyState(config: any) {}

  setState(state: any) {
    // it mutates the state since Angular default change detection checks the property also.
    Object.assign(this.state, state);
  }

  initThemes(themes: Array<string>) {
    this.applyThemes(themes);
  }

  applyThemes(themes: Array<string>) {
    if (this.rendered) {
      if (this.appliedThemeClasses) {
        this.el.classList.remove(...this.appliedThemeClasses);
      }
    }
    this.beforeThemeInit();
    if (themes) {
      themes = getThemeClasses(this.componentName, themes);
      this.el.classList.add(...themes);
      this.appliedThemeClasses = themes;
    }
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

  emitRenderedActionEvent() {
    const action: ComponentActionEvent = {
      target: this,
      action: ComponentAction.RENDERED
    };
    this.action.emit(action);
  }

  destroyCmp() {
    // to remove dom elements reference etc.
  }
}
