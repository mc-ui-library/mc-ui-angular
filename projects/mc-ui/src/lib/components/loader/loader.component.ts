import { ComponentTheme } from './../../shared.models';
import { Component, ElementRef } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ComponentConfig } from '../../shared.models';

interface State {
  theme?: string;
}

@Component({
  selector: 'mc-loader',
  styleUrls: ['loader.component.scss'],
  templateUrl: 'loader.component.html'
})
export class LoaderComponent extends BaseComponent {
  defaultConfig: ComponentConfig = {
    themes: [ComponentTheme.horizontal]
  };

  _config: ComponentConfig;

  state: State;

  constructor(protected er: ElementRef) {
    super(er);
  }

  applyState(config: ComponentConfig) {
    this.setState({ theme: config.themes[0] });
  }
}
