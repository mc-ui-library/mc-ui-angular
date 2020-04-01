import { ComponentAction, ComponentActionEvent } from '../../shared.models';
import { Component, Input, ElementRef, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base.component';
import { DrawerConfig } from '../../shared.models';

interface State {
  mask: boolean;
  tpl: TemplateRef<any>;
}

/**
- Add drawer.component: This is almost the same as the Popup.component, but it is sliding from the top/left/bottom/right with animation effect. The popup and drawer components are dynamic container components for adding them to the body element.
- mask.component: This is used by drawer.component or some components that needs a mask. When drawer component has a smaller content component than the drawer, the empty part will be the mask component. It can have a opacity valued or transparent background.
 */
@Component({
  selector: 'mc-drawer',
  styleUrls: ['drawer.component.scss'],
  templateUrl: 'drawer.component.html'
})
export class DrawerComponent extends BaseComponent {
  defaultConfig: DrawerConfig = {
    from: 'top',
    tpl: null,
    mask: true
  };

  _config: DrawerConfig;

  defaultState: State = {
    mask: true,
    tpl: null
  };

  state: State;

  @ViewChild('drawerEr') drawerEr: ElementRef;

  constructor(protected er: ElementRef) {
    super(er);
  }

  // after rendering, measure the size and hide and show.
  show() {
    this.el.style.visibility = 'hidden';
    this.el.style.display = '';
    // after the targetEl is changed.
    setTimeout(() => {
      const drawerEl = this.drawerEr.nativeElement;
      const width = drawerEl.clientWidth;
      const height = drawerEl.clientHeight;
      let translateY = null;
      let translateX = null;
      let top = 'unset';
      let right = 'unset';
      let bottom = 'unset';
      let left = 'unset';
      switch (this._config.from) {
        case 'top':
          translateY = `-${height}px`;
          top = '0';
          break;
        case 'bottom':
          translateY = `${height}px`;
          bottom = '0';
          break;
        case 'left':
          translateX = `-${width}px`;
          left = '0';
          break;
        case 'right':
          translateX = `${width}px`;
          right = '0';
          break;
      }
      const style = drawerEl.style;
      style.transform = translateY === null ? `translateX(${translateX})` : `translateY(${translateY})`;
      style.opacity = '0';
      style.left = left;
      style.right = right;
      style.bottom = bottom;
      style.top = top;
      if (translateY) {
        style.width = '100%';
      } else {
        style.height = '100%';
      }
      this.el.style.visibility = '';
      // animation
      setTimeout(() => {
        drawerEl.classList.add('drawer-anim');
        style.transform = translateY === null ? `translateX(0)` : `translateY(0)`;
        style.opacity = '1';
        setTimeout(() => drawerEl.classList.remove('drawer-anim'), 300);
      }, 100);
    });
  }

  hide() {
    this.el.style.display = 'none';
    const action: ComponentActionEvent = {
      action: ComponentAction.HID,
      target: this
    };
    this.action.emit(action);
  }

  onClickMask() {
    this.hide();
  }
}
