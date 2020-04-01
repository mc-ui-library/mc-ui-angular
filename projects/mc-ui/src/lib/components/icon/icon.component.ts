import { Component, ElementRef } from '@angular/core';
import { BaseComponent } from '../base.component';
import { IconConfig } from '../../shared.models';

@Component({
  selector: 'mc-icon',
  styleUrls: ['icon.component.scss'],
  templateUrl: './icon.component.html'
})
export class IconComponent extends BaseComponent {
  defaultConfig: IconConfig = {
    icon: ''
  };

  _config: IconConfig;

  constructor(protected er: ElementRef) {
    super(er);
  }

  beforeThemeInit() {
    if (this._config.icon) {
      this.el.classList.add('icon', 'icon-' + this._config.icon);
    }
  }
}
