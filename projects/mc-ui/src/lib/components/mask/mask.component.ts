import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { MaskConfig } from '../../shared.models';
import { isEmpty } from '../../utils/utils';

@Component({
  selector: 'mc-mask',
  styleUrls: ['mask.component.scss'],
  templateUrl: 'mask.component.html'
})
export class MaskComponent extends BaseComponent {
  defaultConfig: MaskConfig = {
    visible: false,
    transparent: false
  };

  _config: MaskConfig;

  @HostBinding('class.visible') @Input() visible = false;
  @HostBinding('class.transparent') private transparent = false;

  constructor(protected er: ElementRef) {
    super(er);
  }

  applyState(config: MaskConfig) {
    if (!isEmpty(config.visible)) {
      this.visible = config.visible;
    }
    this.transparent = config.transparent;
  }
}
