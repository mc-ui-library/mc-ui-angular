import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {
  VisualizerSize,
  VisualizerActionEvent,
  VisualizerConfig,
  VisualizerType,
  VisualizerScaleType,
  Location,
  VisualizerMetaField,
  VisualizerUnit
} from '../../../shared.models';
import {
  getScale,
  getAxis,
  renderChartContainer,
  getAxisSize,
  renderAxis,
  renderGrid,
  getMinMaxMapByField
} from '../../../utils/viz-utils';

@Component({
  selector: 'mc-axis',
  styleUrls: ['axis.component.scss'],
  templateUrl: 'axis.component.html'
})
export class AxisComponent extends BaseComponent {
  defaultConfig: VisualizerConfig = {
    type: VisualizerType.VERTICAL_BAR,
    labelField: '',
    dataFields: null,
    data2Fields: null,
    hasGrid: true,
    ticks: 9,
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

  getSize(): VisualizerSize {
    const width = this.el.offsetWidth;
    const height = this.el.offsetHeight;
    return {
      width,
      height,
      chart: {
        width,
        height
      },
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    };
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
    const yScale = getScale(
      VisualizerScaleType.LINEAR,
      [totalMinMax.min, totalMinMax.max],
      [visualizerSize.chart.height, 0]
    );
    const yAxis = getAxis(Location.LEFT, yScale, config.ticks);

    let y2Scale;
    let y2Axis;
    if (config.data2Fields) {
      const minMaxMap2 = getMinMaxMapByField(config.data2Fields, config.data.data);
      const totalMinMax2 = minMaxMap2.get(VisualizerMetaField.total);
      y2Scale = getScale(VisualizerScaleType.LINEAR, [totalMinMax2.min, totalMinMax2.max], [visualizerSize.chart.height, 0]);
      y2Axis = getAxis(Location.RIGHT, y2Scale, config.ticks);
    }

    // x scale
    const xScale = getScale(
      VisualizerScaleType.BAND,
      this.getLabels(),
      [0, visualizerSize.chart.width],
      config.scalePadding,
      config.scalePaddingInner,
      config.scalePaddingOuter
    );
    const xAxis = getAxis(Location.BOTTOM, xScale);
    return {
      yScale,
      yAxis,
      xScale,
      xAxis,
      y2Scale,
      y2Axis
    };
  }

  updateSize(
    visualizerSize,
    unit,
    containerClass,
    yAxisClass,
    y2AxisClass,
    xAxisClass
  ) {
    // *** render for measuring size ***
    const svg = renderChartContainer(this.el, visualizerSize, [containerClass]);
    // left / right margin
    let size = getAxisSize(this.el, svg, Location.LEFT, unit.yAxis, visualizerSize, [
      yAxisClass
    ]);
    visualizerSize.margin.left = size.width;
    if (this._config.data2Fields) {
      size = getAxisSize(this.el, svg, Location.RIGHT, unit.y2Axis, visualizerSize, [
        y2AxisClass
      ]);
      visualizerSize.margin.right = size.width;
    }
    size = getAxisSize(this.el, svg, Location.BOTTOM, unit.xAxis, visualizerSize, [
      xAxisClass
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
    const containerClass = this.componentName + '-' + 'container';
    const yAxisClass = this.componentName + '-' + 'y-axis';
    const y2AxisClass = this.componentName + '-' + 'y2-axis';
    const xAxisClass = this.componentName + '-' + 'x-axis';

    let visualizerSize = this.getSize();
    let unit = this.getUnit(config, visualizerSize);
    visualizerSize = this.updateSize(
      visualizerSize,
      unit,
      containerClass,
      yAxisClass,
      y2AxisClass,
      xAxisClass
    );
    // update unit by the correct size
    unit = this.getUnit(config, visualizerSize);

    // *** re-render with correct size ***
    const svg = renderChartContainer(this.el, visualizerSize, [containerClass]);
    renderAxis(svg, Location.LEFT, unit.yAxis, visualizerSize.chart, [yAxisClass]);
    if (config.data2Fields) {
      renderAxis(svg, Location.RIGHT, unit.y2Axis, visualizerSize.chart, [
        y2AxisClass
      ]);
    }
    renderAxis(svg, Location.BOTTOM, unit.xAxis, visualizerSize.chart, [xAxisClass]);

    // render grid
    if (config.hasGrid) {
      renderGrid(svg, 'y', unit.yAxis, visualizerSize.chart, [
        this.componentName + '-' + 'y-grid'
      ]);
    }
  }

  destroyCmp() {}
}
