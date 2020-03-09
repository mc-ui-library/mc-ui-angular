import {
  Component,
  Input,
  ElementRef
} from '@angular/core';
import { ChartTypes, BarLineChartConfig, ChartScaleType, Box, Location, ChartSize } from './../../../models';
import {
  ChartBaseComponent
} from '../chart-base.component';
import { renderChartContainer, getMinMax, getScale, renderAxis, getAxis, getSVGSize, renderGrid, getAxisSize } from './../../../utils/chart-utils';

@Component({
  selector: 'mc-bar-line-chart',
  styleUrls: ['bar-line-chart.component.scss'],
  templateUrl: 'bar-line-chart.component.html'
})

export class BarLineChartComponent extends ChartBaseComponent {

  // Basic Properties
  chartConfig: BarLineChartConfig = {
    type: ChartTypes.BAR_LINE,
    padding: 1,
    ticks: 9,
    barConfig: {
      type: ChartTypes.VERTICAL_BAR,
      beautifyMinRatio: 0.95,
      beautibymaxRatio: 1.05
    },
    lineConfig: {
      type: ChartTypes.LINE,
      beautifyMinRatio: 0.95,
      beautibymaxRatio: 1.05
    }
  };

  @Input()
  set config(value: any) {
    if (value) {
      // overwrite the default config if it has custom values
      const barConfig = Object.assign(this.chartConfig.barConfig, value.barConfig);
      const lineConfig = Object.assign(this.chartConfig.lineConfig, value.lineConfig);
      this.chartConfig = Object.assign(this.chartConfig, value);
      this.chartConfig.barConfig = barConfig;
      this.chartConfig.lineConfig = lineConfig;
      this.render(this.chartConfig);
    }
  }
  get config() {
    return this.chartConfig;
  }

  constructor(protected er: ElementRef) {
    super(er);
  }

  getSize(): ChartSize {
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

  getUnit(config: BarLineChartConfig, minMax, chartSize: ChartSize) {
    // y scale
    const yScale = getScale(ChartScaleType.LINEAR, [minMax.bar.min, minMax.bar.max], [chartSize.chart.height, 0]);
    const yAxis = getAxis(Location.LEFT, yScale, config.ticks);

    const y2Scale = getScale(ChartScaleType.LINEAR, [minMax.line.min, minMax.line.max], [chartSize.chart.height, 0]);
    const y2Axis = getAxis(Location.RIGHT, y2Scale, config.ticks);

    // x scale
    const xScale = getScale(ChartScaleType.BAND, config.labels, [0, chartSize.chart.width], config.padding, config.paddingInner, config.paddingOuter);
    const xAxis = getAxis(Location.BOTTOM, xScale);
    return {
      yScale, yAxis, y2Scale, y2Axis, xScale, xAxis
    };
  }

  getMinMax(config) {
    // min max
    const barMinMax = getMinMax(config.barConfig.data);
    if (config.barConfig.hasOwnProperty('min')) {
      barMinMax.min = config.barConfig.min;
    }
    if (config.barConfig.hasOwnProperty('max')) {
      barMinMax.max = config.barConfig.max;
    }

    const lineMinMax = getMinMax(config.lineConfig.data);
    if (config.lineConfig.hasOwnProperty('min')) {
      lineMinMax.min = config.lineConfig.min;
    }
    if (config.lineConfig.hasOwnProperty('max')) {
      lineMinMax.max = config.lineConfig.max;
    }
    return {
      bar: barMinMax,
      line: lineMinMax
    };
  }

  updateSize(chartSize, unit, containerClass, yAxisClass, y2AxisClass, xAxisClass) {
    // *** render for measuring size ***
    const svg = renderChartContainer(this.el, chartSize, [containerClass]);
    // left / right margin
    let size = getAxisSize(this.el, svg, Location.LEFT, unit.yAxis, chartSize, [yAxisClass]);
    chartSize.margin.left = size.width;
    size = getAxisSize(this.el, svg, Location.RIGHT, unit.y2Axis, chartSize, [y2AxisClass]);
    chartSize.margin.right = size.width;
    size = getAxisSize(this.el, svg, Location.BOTTOM, unit.xAxis, chartSize, [xAxisClass]);
    chartSize.margin.bottom = size.height;

    // TODO: need to measure the label width that is overlap each other. If it is overlaped, the label direacton should be 45 degree or something to avoid the overlap.

    // save for re-use the chart drawing area
    chartSize.chart.height = chartSize.height - chartSize.margin.top - chartSize.margin.bottom;
    chartSize.chart.width = chartSize.width - chartSize.margin.left - chartSize.margin.right;

    // *** re-render with correct size ***
    this.el.innerHTML = '';
    return chartSize;
  }

  render(config: BarLineChartConfig) {
    const containerClass = this.componentName + '-' + 'container';
    const yAxisClass = this.componentName + '-' + 'y-axis';
    const y2AxisClass = this.componentName + '-' + 'y2-axis';
    const xAxisClass = this.componentName + '-' + 'x-axis';

    const minMax = this.getMinMax(config);

    let chartSize = this.getSize();
    let unit = this.getUnit(config, minMax, chartSize);
    chartSize = this.updateSize(chartSize, unit, containerClass, yAxisClass, y2AxisClass, xAxisClass);
    // update unit by the correct size
    unit = this.getUnit(config, minMax, chartSize);

    // *** re-render with correct size ***
    const svg = renderChartContainer(this.el, chartSize, [containerClass]);
    renderAxis(svg, Location.LEFT, unit.yAxis, chartSize.chart, [yAxisClass]);
    renderAxis(svg, Location.RIGHT, unit.y2Axis, chartSize.chart, [y2AxisClass]);
    renderAxis(svg, Location.BOTTOM, unit.xAxis, chartSize.chart, [xAxisClass]);

    // render grid
    renderGrid(svg, 'y', unit.yAxis, chartSize.chart, [this.componentName + '-' + 'y-grid']);
  }
}
