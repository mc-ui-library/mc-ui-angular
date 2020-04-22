import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {
  VisualizerActionEvent,
  VisualizerConfig,
  VisualizerType,
  Location,
  VisualizerAction,
  VisualizerRenderInfo,
  VisualizerSize
} from '../../../shared.models';
import {
  renderChartContainer,
  renderAxis,
  renderGrid,
  initVisualizerSize,
  getUnit,
  getSize
} from '../../../utils/viz-utils';

@Component({
  selector: 'mc-axis',
  styleUrls: ['axis.component.scss'],
  template: ''
})
export class AxisComponent extends BaseComponent {
  renderInfo: VisualizerRenderInfo;

  defaultConfig: VisualizerConfig = {
    type: VisualizerType.BAR,
    labelField: '',
    dataFields: null,
    data2Fields: null,
    hasGrid: true,
    ticks: 8,
    scalePadding: 1,
    scalePaddingInner: 0.2,
    scalePaddingOuter: 0,
    data: null,
    decorationMaxRate: 1,
    isManualRender: false
  };

  _config: VisualizerConfig;

  @Output() action = new EventEmitter<VisualizerActionEvent>();

  constructor(protected er: ElementRef) {
    super(er);
  }

  afterInitCmp() {
    const config = this._config;
    const visualizerSize = this.getSize(config);
    this.emitBeforeRenderActionEvent(visualizerSize);
    if (!config.isManualRender) {
      this.render(config, visualizerSize);
    }
  }

  applyConfig(config: VisualizerConfig) {
    if (!config.labelField && config.data && config.data.columns) {
      config.labelField = config.data.columns[0].field;
    }
    if (!config.dataFields && config.data && config.data.columns) {
      config.dataFields = config.data.columns.reduce((fields, column) => {
        if (column.field !== config.labelField) {
          fields.push(column.field);
        }
        return fields;
      }, []);
    }
  }

  getSize(config: VisualizerConfig): VisualizerSize {
    const visualizerSize = initVisualizerSize(this.el);
    const unit = getUnit(config, visualizerSize);
    return getSize(this.el, config, visualizerSize, unit);
  }

  render(config: VisualizerConfig, visualizerSize: VisualizerSize) {
    // update unit by the correct size
    const unit = getUnit(config, visualizerSize);

    // *** re-render with correct size ***
    const svg = renderChartContainer(this.el, visualizerSize);
    renderAxis(svg, Location.LEFT, unit.yAxis, visualizerSize.chart, [
      'y-axis'
    ]);
    if (config.data2Fields) {
      renderAxis(svg, Location.RIGHT, unit.y2Axis, visualizerSize.chart, [
        'y2-axis'
      ]);
    }
    renderAxis(svg, Location.BOTTOM, unit.xAxis, visualizerSize.chart, [
      'x-axis'
    ]);

    // render grid
    if (config.hasGrid) {
      renderGrid(svg, 'y', unit.yAxis, visualizerSize.chart, ['y-grid']);
    }
    this.renderInfo = {
      svg,
      unit,
      size: visualizerSize
    };
    return this.renderInfo;
  }

  emitBeforeRenderActionEvent(visualizerSize: VisualizerSize) {
    const action: VisualizerActionEvent = {
      target: this,
      action: VisualizerAction.BEFORE_RENDER,
      config: this._config,
      visualizerSize
    };
    this.action.emit(action);
  }

  emitRenderedActionEvent() {
    const action: VisualizerActionEvent = {
      target: this,
      action: VisualizerAction.RENDERED,
      config: this._config,
      renderInfo: this.renderInfo
    };
    this.action.emit(action);
  }
}
