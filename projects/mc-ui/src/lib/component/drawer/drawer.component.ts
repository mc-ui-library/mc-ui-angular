import {
  Component,
  Input,
  ElementRef,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';
import {
  MCUIService
} from '../../mc-ui.service';

@Component({
  selector: 'mc-drawer',
  styleUrls: ['drawer.component.scss'],
  templateUrl: 'drawer.component.html'
})

export class DrawerComponent extends BaseComponent {

  private _visible = false;

  @Input() from: 'top' | 'left' | 'right' | 'bottom' = 'top';
  @Input() tpl: TemplateRef < any > = null;
  @Input() mask = true;
  @Input()
  set visible(value: boolean) {
    this._visible = value;
    if (value) {
      this.show();
    } else {
      this.hide();
    }
  }
  get visible() {
    return this._visible;
  }

  @Output() hided: EventEmitter < any > = new EventEmitter();

  @ViewChild('drawerEr', {static: false}) drawerEr: ElementRef;

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
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
      switch (this.from) {
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
    this.hided.emit({ target: this });
  }

  onClickMask() {
    this.visible = false;
  }
}
