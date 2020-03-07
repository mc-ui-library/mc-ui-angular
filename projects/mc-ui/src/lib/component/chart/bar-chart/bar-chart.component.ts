import { ChartData, BarTypes } from './../../model';
import {
  ChartBaseComponent
} from './../chart-base.component';
import {
  MCUIService
} from './../../../mc-ui.service';
import {
  BaseComponent
} from './../../base.component';
import {
  Component,
  Input,
  ElementRef,
  HostBinding,
  HostListener
} from '@angular/core';
import { BarChartConfig } from '../../model';

/**
 * data: [
 *  { label: xx, values: [ { series: x, value: x },... ]},
 *  { label: xx2, values: [...]},
 *  ...
 * ]
 */
@Component({
  selector: 'mc-bar-chart',
  styleUrls: ['bar-chart.component.scss'],
  templateUrl: 'bar-chart.component.html'
})

export class BarChartComponent extends ChartBaseComponent {

  // Basic Properties
  chartConfig: BarChartConfig = {
    type: 'bar',
    subType: BarTypes.VERTICAL,
    data: [],
    rectWidth: 20,
    zeroLikeValue: 0,
    minRatio: 0.95,
    maxRatio: 1.05
  };

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  render(config: BarChartConfig) {
    const size = this.el.getBoundingClientRect();
    const chartUtil = this.service.util.chart;
    const domain = chartUtil.getBarDataDomain(config.data, config.zeroLikeValue, config.minValue, config.maxValue);
    const chartWidth = chartUtil.getFixedGroupBarContainerWidth(config.labels.length, config.series.length, config.rectWidth);
    const scaleX = chartUtil.getScale('band', config.labels, [0, chartWidth]);
    const scaleGroupX = chartUtil.getScale('band', config.series, [0, scaleX.bandWidth()]);
    const scaleY = chartUtil.getScale('linear', [domain.min, domain.max], [size.height, 0]);
    const axisX = chartUtil.getAxis('bottom', scaleX);
    const axisY = chartUtil.getAxis('left', scaleY);
    // render x/y axis for calc size
    const svg = chartUtil.renderContainer(this.el, ['mc-bar-chart--container']);
    chartUtil.renderAxis(svg, 'bottom', axisX, size);
    chartUtil.renderAxis(svg, 'left', axisY, size);


    // need to get x axis height, y axis width size
    // render x/y axis first



  }
}
