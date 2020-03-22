import { Component, ElementRef, HostBinding } from '@angular/core';
import { BaseComponent } from '../base.component';
import { MaskConfig } from '../../mc-ui.models';

@Component({
  selector: 'mc-mask',
  styleUrls: ['mask.component.scss'],
  templateUrl: 'mask.component.html'
})
export class MaskComponent extends BaseComponent {
  _config: MaskConfig = {
    visible: false,
    transparent: false
  };

  @HostBinding('class.visible') private visible = false;
  @HostBinding('class.transparent') private transparent = false;

  constructor(protected er: ElementRef) {
    super(er);
  }

  applyConfig(config: MaskConfig) {
    this.visible = config.visible;
    this.transparent = config.transparent;
  }
}
