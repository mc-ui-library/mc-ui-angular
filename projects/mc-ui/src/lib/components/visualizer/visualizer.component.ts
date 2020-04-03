import { VisualizerConfig, VisualizerType, GridConfig, GridActionEvent, GridAction } from '../../shared.models';
import { Component, ElementRef, Input, ComponentRef } from '@angular/core';
import { BaseComponent } from '../base.component';
import { SharedService } from '../../shared.service';
import { GridComponent } from '../grid/grid.component';
import { convertVizToGridData } from '../../utils/viz-utils';
import { Subscription } from 'rxjs';

interface State {
}

@Component({
  selector: 'mc-visualizer',
  styleUrls: ['visualizer.component.scss'],
  templateUrl: 'visualizer.component.html'
})
export class VisualizerComponent extends BaseComponent {

  private cr: ComponentRef<any>;
  private compSubs: Array<Subscription> = [];

  defaultConfig: VisualizerConfig = {
    type: VisualizerType.grid,
    config: {},
    data: null
  };

  _config: VisualizerConfig;

  defaultState: State = {
  };

  state: State;

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
    this.removeContent();
    const gridCmp: ComponentRef<GridComponent> = this.sharedService.addComponent(GridComponent, this.el);
    const instance = gridCmp.instance;
    const data = convertVizToGridData(config.data);
    const rows = data.rows;
    const rowCount = data.rows.length;
    const columns = data.columns;
    const cfg: GridConfig = Object.assign({
      themes: config.themes.concat(),
      columns
    }, config.config);
    instance.config = cfg;
    this.compSubs.push(instance.action.subscribe((e: GridActionEvent) => {
      switch (e.action) {
        case GridAction.GET_DATA:
          setTimeout(() => instance.data = { rows, rowCount });
          break;
      }
    }));
    this.cr = gridCmp;
  }

  removeContent() {
    if (this.cr) {
      this.compSubs.forEach(s => s.unsubscribe());
      this.sharedService.removeComponent(this.cr);
      this.cr = null;
    }
  }

  destroyCmp() {
    this.removeContent();
  }
}
