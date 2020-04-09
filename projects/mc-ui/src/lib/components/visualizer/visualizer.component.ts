import {
  VisualizerConfig,
  VisualizerType,
  GridConfig,
  GridActionEvent,
  GridAction,
  VisualizerActionEvent,
  VisualizerAction
} from '../../shared.models';
import {
  Component,
  ElementRef,
  Input,
  ComponentRef,
  Output,
  EventEmitter
} from '@angular/core';
import { BaseComponent } from '../base.component';
import { SharedService } from '../../shared.service';
import { GridComponent } from '../grid/grid.component';
import { Subscription } from 'rxjs';
import { BarComponent } from './bar/bar.component';

@Component({
  selector: 'mc-visualizer',
  styleUrls: ['visualizer.component.scss'],
  templateUrl: 'visualizer.component.html'
})
export class VisualizerComponent extends BaseComponent {
  private cr: ComponentRef<any>;
  private compSubs: Array<Subscription> = [];

  defaultConfig: VisualizerConfig = {
    type: VisualizerType.GRID,
    gridConfig: {},
    labelField: '',
    dataFields: null,
    data2Fields: null,
    hasGrid: true,
    ticks: 8,
    scalePadding: 1,
    scalePaddingInner: 0.2,
    scalePaddingOuter: 0,
    data: null
  };

  _config: VisualizerConfig;

  @Input()
  set data(data: any) {
    if (data) {
      this._config.data = data;
      if (this.rendered) {
        this.render(this._config);
      }
    }
  }

  @Output() action = new EventEmitter<VisualizerActionEvent>();

  constructor(protected er: ElementRef, private sharedService: SharedService) {
    super(er);
  }

  afterInitCmp() {
    this.render(this._config);
  }

  render(config: VisualizerConfig) {
    if (config.data) {
      switch (config.type) {
        case VisualizerType.GRID:
          this.rednerGrid(config);
          break;
        case VisualizerType.BAR:
          this.renderBar(config);
          break;
      }
    }
  }

  renderBar(config: VisualizerConfig) {
    this.removeContent();
    const cr: ComponentRef<BarComponent> = this.sharedService.addComponent(
      BarComponent,
      this.el
    );
    const instance = cr.instance;
    instance.config = config;
    this.cr = cr;
  }

  rednerGrid(config: VisualizerConfig) {
    this.removeContent();
    const cr: ComponentRef<GridComponent> = this.sharedService.addComponent(
      GridComponent,
      this.el
    );
    const instance = cr.instance;
    const { columns, data } = config.data;
    const cfg: GridConfig = Object.assign(
      {
        themes: ['visualizer', ...config.themes],
        rowHeight: 42,
        columns,
        data: {
          rows: data,
          rowCount: data.length
        }
      },
      config.gridConfig
    );
    instance.config = cfg;
    this.compSubs.push(
      instance.action.subscribe((e: GridActionEvent) => {
        switch (e.action) {
          case GridAction.SELECT_ROW:
            this.action.emit({
              target: this,
              event: e,
              action: VisualizerAction.SELECT_ITEM,
              data: e.rowData,
              el: e.rowEl
            });
            break;
        }
      })
    );
    this.cr = cr;
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
