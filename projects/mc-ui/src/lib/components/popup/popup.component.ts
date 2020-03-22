import { ComponentActionEvent, ComponentAction } from '../../mc-ui.models';
import { McUiService } from './../../mc-ui.service';
import { BaseComponent } from './../base.component';
import { Component, ElementRef, HostBinding, TemplateRef } from '@angular/core';
import { PopupConfig } from '../../mc-ui.models';

interface State {
  tpl: TemplateRef<any>;
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

  lastTargetElCoord: ClientRect;
  indicatorLocation: string | 'tl' | 'tr' | 'bl' | 'br' = 'bl'; // 'tl' | 'tr' | 'bl' | 'br' = 'bl'

  _config: PopupConfig = {
    checkTargetLocation: true,
    startFrom: 'center',
    offsetX: 0,
    offsetY: 0,
    tpl: null,
    targetEl: null,
    hasIndicator: true,
    center: false,
    hasBorder: true,
    hasCloseButton: true
  };

  state: State = {
    tpl: null
  };

  @HostBinding('class.center') private center = false;
  @HostBinding('class.has-border') private hasBorder = true;
  @HostBinding('class.has-close-button') private hasCloseButton = true;
  @HostBinding('class.popup-indicator') private hasIndicator = true;

  constructor(protected er: ElementRef, private service: McUiService) {
    super(er);
    this.subscriptions = service.bodyPress.subscribe(this.onPressBody.bind(this));
  }

  applyConfig(config: PopupConfig) {
    this.center = config.center;
    this.hasBorder = config.hasBorder;
    this.hasCloseButton = config.hasCloseButton;
    this.hasIndicator = config.hasIndicator;
    this.applyTargetEl(config);
  }

  applyTargetEl(config: PopupConfig) {
    if (config.targetEl) {
      this.lastTargetElCoord = config.targetEl.getBoundingClientRect();
      this.show();
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
      const targetSize = this.lastTargetElCoord;
      // when the popup overflow the window size, we need to move into the window.
      const indicatorHeight = config.hasIndicator ? this.indicatorHeight : 0;
      const popupSize = this.el.getBoundingClientRect();
      const windowSize = this.getWindowSize();

      // indicator location
      const isLeft =
        targetSize.left +
          (config.startFrom === 'center' ? targetSize.width / 2 : 0) +
          popupSize.width +
          config.offsetX <=
        windowSize.width;
      const isTop =
        targetSize.top + targetSize.height + popupSize.height + config.offsetY + indicatorHeight <= windowSize.height;
      const left = isLeft
        ? targetSize.left + (config.startFrom === 'center' ? targetSize.width / 2 : 0) + config.offsetX
        : targetSize.left -
          popupSize.width +
          (config.startFrom === 'center' ? targetSize.width / 2 : targetSize.width) -
          config.offsetX;
      const top = isTop
        ? targetSize.top + (config.startFrom === 'overlap' ? 0 : targetSize.height) + config.offsetY + indicatorHeight
        : targetSize.top -
          popupSize.height -
          config.offsetY -
          indicatorHeight +
          (config.startFrom === 'overlap' ? targetSize.height : 0);
      this.indicatorLocation = (isTop ? 't' : 'b') + (isLeft ? 'l' : 'r');
      this.el.style.left = left + 'px';
      this.el.style.top = top + 'px';
      // remove the prev indicator and add the new indicator
      let classNames = this.el.className.split(' ');
      classNames = classNames.filter(d => !d.includes('popup-indicator-'));
      classNames.push('popup-indicator-' + (isTop ? 'top' : 'bottom') + '-' + (isLeft ? 'left' : 'right'));
      this.el.className = classNames.join(' ');
      if (!resizeOnly) {
        this.el.style.visibility = '';
      }
    });
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
