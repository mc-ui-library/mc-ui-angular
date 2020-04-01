import { Icon, ComponentTheme, PopupStartFrom } from './../../shared.models';
import { ComponentActionEvent, ComponentAction } from '../../shared.models';
import { SharedService } from './../../shared.service';
import { BaseComponent } from './../base.component';
import { Component, ElementRef, HostBinding, TemplateRef } from '@angular/core';
import { PopupConfig } from '../../shared.models';

interface State {
  tpl: TemplateRef<any>;
}

interface PopupCoords {
  top: number;
  left: number;
  indicatorIsLeft: boolean;
  indicatorIsTop: boolean;
}

@Component({
  selector: 'mc-popup',
  styleUrls: ['popup.component.scss'],
  templateUrl: 'popup.component.html'
})
export class PopupComponent extends BaseComponent {
  // for body press event, it is triggered after clicking the target. We need to ignore the body event when visible = true;
  private bodyEventLock = false;
  private checkTargetElLocationIntervalId: number;
  private indicatorHeight = 10;

  private lastTargetElCoord: ClientRect;

  Icon = Icon;
  Theme = ComponentTheme;

  defaultConfig: PopupConfig = {
    checkTargetLocation: true,
    startFrom: PopupStartFrom.BOTTOM,
    offsetX: 0,
    offsetY: 0,
    tpl: null,
    targetEl: null,
    hasIndicator: true,
    center: false,
    hasBorder: true,
    hasCloseButton: true
  };

  _config: PopupConfig;

  defaultState: State = {
    tpl: null
  };

  state: State;

  @HostBinding('class.center') private center = false;
  @HostBinding('class.has-border') private hasBorder = true;
  @HostBinding('class.has-close-button') private hasCloseButton = true;
  @HostBinding('class.popup-indicator') private hasIndicator = true;

  constructor(protected er: ElementRef, private service: SharedService) {
    super(er);
    this.subscriptions = service.bodyPress.subscribe(this.onPressBody.bind(this));
  }

  applyState(config: PopupConfig) {
    this.center = config.center;
    this.hasBorder = config.hasBorder;
    this.hasCloseButton = config.hasCloseButton;
    this.hasIndicator = config.hasIndicator;
    if (config.targetEl) {
      this.lastTargetElCoord = config.targetEl.getBoundingClientRect();
    }
  }

  show(resizeOnly = false) {
    const config = this._config;
    this.holdBodyEvent();
    if (config.center) {
      this.el.style.display = '';
      return;
    }

    // renew check.
    if (!resizeOnly) {
      this.uncheckTargetLocation();
      this.checkTargetElLocation();
    }

    // for updating the last size;
    this.lastTargetElCoord = config.targetEl.getBoundingClientRect();
    if (!resizeOnly) {
      this.el.style.visibility = 'hidden';
      this.el.style.display = '';
    }
    // after the targetEl is changed.
    setTimeout(() => {
      // it can be removed
      if (!this.el) {
        return;
      }

      const coords = this.getCoords(config);
      this.el.style.left = coords.left + 'px';
      this.el.style.top = coords.top + 'px';
      // remove the prev indicator and add the new indicator
      let classNames = this.el.className.split(' ');
      classNames = classNames.filter(d => !d.includes('popup-indicator-'));
      classNames.push(
        'popup-indicator-' +
          (coords.indicatorIsTop ? 'top' : 'bottom') +
          '-' +
          (coords.indicatorIsLeft ? 'left' : 'right')
      );
      this.el.className = classNames.join(' ');
      if (!resizeOnly) {
        this.el.style.visibility = '';
      }
    });
  }

  getCoords(config: PopupConfig): PopupCoords {
    const targetSize = this.lastTargetElCoord;
    // when the popup overflow the window size, we need to move into the window.
    const indicatorHeight = config.hasIndicator ? this.indicatorHeight : 0;
    const popupSize = this.el.getBoundingClientRect();
    const windowSize = this.getWindowSize();

    const indicatorIsLeft =
      targetSize.left + targetSize.width / 2 + popupSize.width + config.offsetX <= windowSize.width;

    const left = indicatorIsLeft
      ? targetSize.left + targetSize.width / 2 + config.offsetX
      : targetSize.left - popupSize.width + targetSize.width / 2 - config.offsetX;

    let indicatorIsTop = true;
    let top = 0;

    switch (config.startFrom) {
      case PopupStartFrom.BOTTOM:
        indicatorIsTop =
          targetSize.top + targetSize.height + popupSize.height + config.offsetY + indicatorHeight <= windowSize.height;
        break;
      case PopupStartFrom.TOP:
        indicatorIsTop = targetSize.top - popupSize.height + config.offsetY - indicatorHeight <= 0;
        break;
    }

    top = indicatorIsTop
      ? targetSize.top + targetSize.height + config.offsetY + indicatorHeight
      : targetSize.top - popupSize.height - config.offsetY - indicatorHeight;

    return {
      top,
      left,
      indicatorIsTop,
      indicatorIsLeft
    };
  }

  resize() {
    this.show(true);
  }

  hide() {
    this.uncheckTargetLocation();
    this.el.style.display = 'none';
    const action: ComponentActionEvent = {
      action: ComponentAction.HID,
      target: this
    };
    this.action.emit(action);
  }

  // the body click event is triggered after clicking the target and it closes the popup, so need to prevent it.
  holdBodyEvent() {
    this.bodyEventLock = true;
    setTimeout(() => (this.bodyEventLock = false));
  }

  checkTargetElLocation() {
    const config = this._config;
    if (config.targetEl && config.checkTargetLocation) {
      this.checkTargetElLocationIntervalId = window.setInterval(() => {
        const info = config.targetEl.getBoundingClientRect();
        const lastInfo = this.lastTargetElCoord;
        if (lastInfo) {
          if (info.top !== lastInfo.top || info.left !== lastInfo.left) {
            this.hide();
          }
        } else {
          this.lastTargetElCoord = info;
        }
      }, 500);
    }
  }

  uncheckTargetLocation() {
    if (this.checkTargetElLocationIntervalId) {
      clearInterval(this.checkTargetElLocationIntervalId);
      delete this.checkTargetElLocationIntervalId;
    }
  }

  getWindowSize() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return { width, height };
  }

  onPressBody(e) {
    if (!this.bodyEventLock && !this.el.contains(e.target)) {
      const pos = this.el.compareDocumentPosition(e.target);
      // console.log('compareDocumentPosition:' + pos);
      // some overlay items can't be in the container. it returns 35 or 37.
      if (pos < 33) {
        this.hide();
      }
    }
  }

  onClickCloseButton() {
    this.hide();
  }

  destroyCmp() {
    this.uncheckTargetLocation();
  }
}
