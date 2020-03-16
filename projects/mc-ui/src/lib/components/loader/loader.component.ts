import {
  Component,
  ElementRef,
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';
import { ComponentConfig } from '../../models';

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

  setState(config: ComponentConfig) {
    super.setState(config);
    const theme = config.themes[0];
    this.state = Object.assign({ theme }, this.state);
  }
}
