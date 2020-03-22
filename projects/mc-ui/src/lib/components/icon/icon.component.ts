import { Component, ElementRef, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { IconConfig } from '../../mc-ui.models';

@Component({
  selector: 'mc-icon',
  styleUrls: ['icon.component.scss'],
  templateUrl: './icon.component.html'
})
export class IconComponent extends BaseComponent {
  _config: IconConfig = {
    icon: ''
  };

  constructor(protected er: ElementRef) {
    super(er);
  }

  beforeThemeInit() {
    if (this._config.icon) {
      this.el.classList.add('icon', 'icon-' + this._config.icon);
    }
  }
}
