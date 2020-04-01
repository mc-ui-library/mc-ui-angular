import { VisualizerConfig, VisualizerType, GridConfig } from '../../shared.models';
import { Component, ViewChild, ElementRef, Input, ComponentRef } from '@angular/core';
import { BaseComponent } from '../base.component';
import { SharedService } from '../../shared.service';
import { GridComponent } from '../grid/grid.component';

interface State {
}

@Component({
  selector: 'mc-visualizer',
  styleUrls: ['visualizer.component.scss'],
  templateUrl: 'visualizer.component.html'
})
export class VisualizerComponent extends BaseComponent {

  private cr: ComponentRef<any>;

  defaultConfig: VisualizerConfig = {
    type: VisualizerType.grid,
    config: {},
    data: null
  };

  _config: VisualizerConfig;

  defaultState: State = {
  };

  state: State;

  @ViewChild('contentEr') contentEr: ElementRef;

  @Input()
  set data(data: any) {
    if (data) {
      this._config.data = data;
      if (this.rendered) {
        this.render(this._config);
      }
    }
  }

  constructor(protected er: ElementRef, private sharedService: SharedService) {
    super(er);
  }

  afterInitCmp() {
    this.render(this._config);
  }

  render(config: VisualizerConfig) {
    if (config.data) {
      switch (config.type) {
        case VisualizerType.grid:
          this.rednerGrid(config);
          break;
      }
    }
  }

  rednerGrid(config: VisualizerConfig) {
    this.cr = this.sharedService.addComponent(GridComponent, this.contentEr.nativeElement);
    const instance = this.cr.instance;
    const cfg: GridConfig = {
      themes: config.themes.concat()
    };
    instance.config = cfg;
  }

  removeContent() {
    if (this.cr) {
      this.sharedService.removeComponent(this.cr);
      this.cr = null;
    }
  }
}
