import { Component, ElementRef } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ComponentConfig } from '../../mc-ui.models';
import { setState } from '../../utils/data-utils';

interface State {
  theme?: string;
}

@Component({
  selector: 'mc-loader',
  styleUrls: ['loader.component.scss'],
  templateUrl: 'loader.component.html'
})
export class LoaderComponent extends BaseComponent {
  _config: ComponentConfig = {
    themes: ['horizontal']
  };

  state: State = {};

  constructor(protected er: ElementRef) {
    super(er);
  }

  applyState(config: ComponentConfig) {
    const theme = config.themes[0];
    this.state = setState(this.state, { theme });
  }
}
