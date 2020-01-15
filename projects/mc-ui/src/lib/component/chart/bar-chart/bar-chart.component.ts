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

  chartType = 'bar';

  private barType = '';
  private halfShift = false;
  private rectWidth = 20;
  private animDuration = 500;
  private domain: any = {};
  private hasNegativeValue = false;
  private valueLikeZero = 5;
  // for beauty
  private minRatio;
  private maxRatio;
  private maxValue;
  private minValue;
  private maxBarWidth = 100;

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }
}
