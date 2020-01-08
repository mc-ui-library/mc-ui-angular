import {
  Component,
  Input,
  ElementRef,
  HostBinding,
  TemplateRef,
  EventEmitter,
  Output
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';
import {
  MCUIService
} from '../../mc-ui.service';

@Component({
  selector: 'mc-popup',
  styleUrls: ['popup.component.scss'],
  templateUrl: 'popup.component.html'
})

export class PopupComponent extends BaseComponent {

  private _visible = false;
  private _targetEl: HTMLElement;
  private _hasIndicator = false;
  // for body press event, it is triggered after clicking the target. We need to ignore the body event when visible = true;
  private bodyEventLock = false;
  private checkTargetElLocationIntervalId: number;
  private indicatorHeight = 10;

  lastTargetElCoord: ClientRect;
  indicatorLocation = 'bl'; // 'tl' | 'tr' | 'bl' | 'br' = 'bl'

  @Input() checkTargetLocation = false;
  // top left is the base state.
  @Input() startFrom: 'center' | 'start' | 'overlap' = 'center';
  @Input() offsetX = 0;
  @Input() offsetY = 0;
  @Input() useTargetWidth = false;
  @Input() tpl: TemplateRef < any > = null;
  @Input()
  set targetEl(value: HTMLElement) {
    this._targetEl = value;
    if (value) {
      this.lastTargetElCoord = value.getBoundingClientRect();
    }
    this.show();
  }
  get targetEl() {
    return this._targetEl;
  }
  @Input()
  set visible(value: boolean) {
    this._visible = value;
    if (value && this.targetEl) {
      this.show();
    } else {
      this.doHide();
    }
  }
  get visible() {
    return this._visible;
  }
  @Input()
  set hasIndicator(value: boolean) {
    if (value) {
      this.el.classList.add('popup-indicator');
    } else {
      this.el.classList.remove('popup-indicator');
    }
    this._hasIndicator = value;
  }
  get hasIndicator() {
    return this._hasIndicator;
  }

  @Output() hide: EventEmitter < any > = new EventEmitter();

  @HostBinding('class.center') @Input() center = false;

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
    this.subscriptions = service.bodyPress.subscribe(this.onPressBody.bind(this));
  }

  show(resizeOnly = false) {
    if (!this.visible) {
      return;
    }

    this.holdBodyEvent();

    if (this.center) {
      this.el.style.display = '';
      return;
    }

    // renew check.
    if (!resizeOnly) {
      this.uncheckTargetLocation();
      this.checkTargetElLocation();
    }

    // for updating the last size;
    this.lastTargetElCoord = this.targetEl.getBoundingClientRect();
    if (!resizeOnly) {
      this.el.style.visibility = 'hidden';
      this.el.style.display = '';
    }
    // after the targetEl is changed.
    setTimeout(() => {
      const targetSize = this.lastTargetElCoord;
      // when the popup overflow the window size, we need to move into the window.
      const indicatorHeight = this.hasIndicator ? this.indicatorHeight : 0;
      const popupSize = this.el.getBoundingClientRect();
      const windowSize = this.util.dom.getWindowSize();

      // indicator location
      const isLeft = targetSize.left + (this.startFrom === 'center' ? targetSize.width / 2 : 0) + popupSize.width  + this.offsetX <= windowSize.width;
      const isTop =  targetSize.top  + targetSize.height    + popupSize.height + this.offsetY + indicatorHeight <= windowSize.height;
      const left = isLeft ? targetSize.left + (this.startFrom === 'center' ? targetSize.width / 2 : 0) + this.offsetX : targetSize.left - popupSize.width + (this.startFrom === 'center' ? targetSize.width / 2 : targetSize.width) - this.offsetX;
      const top = isTop ? targetSize.top + (this.startFrom === 'overlap' ? 0 : targetSize.height) + this.offsetY + indicatorHeight : targetSize.top - popupSize.height - this.offsetY - indicatorHeight + (this.startFrom === 'overlap' ? targetSize.height : 0);
      this.indicatorLocation = (isTop ? 't' : 'b') + (isLeft ? 'l' : 'r');
      this.el.style.left = left + 'px';
      this.el.style.top = top + 'px';
      // remove the prev indicator and add the new indicator
      let classNames = this.el.className.split(' ');
      classNames = classNames.filter(d => d.indexOf('popup-indicator-') === -1);
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

  doHide() {
    this.uncheckTargetLocation();
    this.el.style.display = 'none';
    this.hide.emit({ target: this });
  }

  // the body click event is triggered after clicking the target and it closes the popup, so need to prevent it.
  holdBodyEvent() {
    this.bodyEventLock = true;
    setTimeout(() => this.bodyEventLock = false);
  }

  checkTargetElLocation() {
    if (this.targetEl && this.checkTargetLocation) {
      this.checkTargetElLocationIntervalId = window.setInterval(() => {
        const info = this.targetEl.getBoundingClientRect();
        const lastInfo = this.lastTargetElCoord;
        if (lastInfo) {
          if (info.top !== lastInfo.top || info.left !== lastInfo.left) {
            this.visible = false;
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

  onPressBody(e) {
    if (!this.bodyEventLock && !this.el.contains(e.target)) {
      const pos = this.el.compareDocumentPosition(e.target);
      // console.log('compareDocumentPosition:' + pos);
      // some overlay items can't be in the container. it returns 35 or 37.
      if (pos < 33) {
        this.visible = false;
      }
    }
  }

  destroyCmp() {
    this.uncheckTargetLocation();
  }
}
