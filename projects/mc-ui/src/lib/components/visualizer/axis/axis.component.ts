import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {
  VisualizerSize,
  VisualizerActionEvent,
  VisualizerConfig,
  VisualizerType,
  Location,
  VisualizerMetaField,
  VisualizerUnit,
  ComponentActionEvent,
  ComponentAction,
  VisualizerAction,
  VisualizerRenderInfo
} from '../../../shared.models';
import {
  renderChartContainer,
  getAxisSize,
  renderAxis,
  renderGrid,
  getMinMaxMapByField,
  initVisualizerSize
} from '../../../utils/viz-utils';
import * as d3 from 'd3';

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
    data: null
  };

  _config: VisualizerConfig;

  @Output() action = new EventEmitter<VisualizerActionEvent>();

  constructor(protected er: ElementRef) {
    super(er);
  }

  afterInitCmp() {
    this.render(this._config);
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

  getLabels(): Array<string> {
    const data = this._config.data;
    if (data) {
      const labelField = this._config.labelField || data.columns[0].field;
      return data.data.map(d => d[labelField]);
    }
    return [];
  }

  getUnit(config: VisualizerConfig, visualizerSize: VisualizerSize): VisualizerUnit {
    const minMaxMap = getMinMaxMapByField(config.dataFields, config.data.data);
    const totalMinMax = minMaxMap.get(VisualizerMetaField.total);
    // y scale
    const yScale = d3.scaleLinear()
    .domain([totalMinMax.min, totalMinMax.max])
    .rangeRound([visualizerSize.chart.height, 0]);

    const yAxis = d3.axisLeft(yScale).ticks(config.ticks);

    let y2Scale;
    let y2Axis;
    let totalMinMax2;
    if (config.data2Fields) {
      const minMaxMap2 = getMinMaxMapByField(config.data2Fields, config.data.data);
      totalMinMax2 = minMaxMap2.get(VisualizerMetaField.total);
      y2Scale = d3.scaleLinear()
      .domain([totalMinMax2.min, totalMinMax2.max])
      .rangeRound([visualizerSize.chart.height, 0]);
      y2Axis = d3.axisRight(y2Scale).ticks(config.ticks);
    }

    // x scale
    const labels = this.getLabels();
    const xScale = d3.scaleBand()
    .domain(labels)
    .rangeRound([0, visualizerSize.chart.width])
    .padding(config.scalePadding)
    .paddingInner(config.scalePaddingInner)
    .paddingOuter(config.scalePaddingOuter);

    const xAxis = d3.axisBottom(xScale);
    // TODO: you can have a color array instead of "schemeCategory20" things.
    const colorScale = d3.scaleOrdinal('schemeCategory20');
    return {
      yScale,
      yAxis,
      xScale,
      xAxis,
      y2Scale,
      y2Axis,
      labels,
      colorScale,
      fields: config.dataFields,
      fields2: config.data2Fields,
      minMax: totalMinMax,
      minMax2: totalMinMax2
    };
  }

  getSize(
    visualizerSize,
    unit
  ) {
    // *** render for measuring size ***
    const svg = renderChartContainer(this.el, visualizerSize);
    // left / right margin
    let size = getAxisSize(this.el, svg, Location.LEFT, unit.yAxis, visualizerSize, [
      'y-axis'
    ]);
    visualizerSize.margin.left = size.width;
    if (this._config.data2Fields) {
      size = getAxisSize(this.el, svg, Location.RIGHT, unit.y2Axis, visualizerSize, [
        'y2-axis'
      ]);
      visualizerSize.margin.right = size.width;
    }
    size = getAxisSize(this.el, svg, Location.BOTTOM, unit.xAxis, visualizerSize, [
      'x-axis'
    ]);
    visualizerSize.margin.bottom = size.height;

    // TODO: need to measure the label width that is overlap each other.
    // If it is overlaped, the label direacton should be 45 degree or something to avoid the overlap.

    // save for re-use the chart drawing area
    visualizerSize.chart.height =
      visualizerSize.height - visualizerSize.margin.top - visualizerSize.margin.bottom;
    visualizerSize.chart.width =
      visualizerSize.width - visualizerSize.margin.left - visualizerSize.margin.right;

    // *** re-render with correct size ***
    this.el.innerHTML = '';
    return visualizerSize;
  }

  render(config: VisualizerConfig) {
    let visualizerSize = initVisualizerSize(this.el);
    let unit = this.getUnit(config, visualizerSize);
    visualizerSize = this.getSize(
      visualizerSize,
      unit
    );
    // update unit by the correct size
    unit = this.getUnit(config, visualizerSize);

    // *** re-render with correct size ***
    const svg = renderChartContainer(this.el, visualizerSize);
    renderAxis(svg, Location.LEFT, unit.yAxis, visualizerSize.chart, ['y-axis']);
    if (config.data2Fields) {
      renderAxis(svg, Location.RIGHT, unit.y2Axis, visualizerSize.chart, [
        'y2-axis'
      ]);
    }
    renderAxis(svg, Location.BOTTOM, unit.xAxis, visualizerSize.chart, ['x-axis']);

    // render grid
    if (config.hasGrid) {
      renderGrid(svg, 'y', unit.yAxis, visualizerSize.chart, ['y-grid']);
    }
    this.renderInfo = {
      svg,
      unit,
      size: visualizerSize
    };
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
