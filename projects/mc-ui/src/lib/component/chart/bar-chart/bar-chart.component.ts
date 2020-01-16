import { ChartData } from './../../model';
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
    subType: 'vertical',
    data: [],
    rectWidth: 20,
    zeroLikeValue: 5,
    minRatio: 0.95,
    maxRatio: 1.05
  };

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  calcDomain(config: BarChartConfig) {
    return this.service.util.chart.getBarDataDomain(config.data, config.zeroLikeValue, config.minValue, config.maxValue);
  }
}
