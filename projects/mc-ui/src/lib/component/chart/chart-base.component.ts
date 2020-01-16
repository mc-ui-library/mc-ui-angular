import { BarChartConfig, ChartData } from './../model';
import {
  MCUIService
} from './../../mc-ui.service';
import {
  ElementRef,
  Input
} from '@angular/core';
import {
  BaseComponent
} from './../base.component';

export class ChartBaseComponent extends BaseComponent {

  chartConfig: any;
  domain: any;

  @Input()
  set config(value: any) {
    if (value) {
      this.chartConfig = Object.assign(this.chartConfig, value);
      this.render(this.chartConfig);
    }
  }
  get config() {
    return this.chartConfig;
  }

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  calcDomain(config) {}

  initConfig(config: any = {}) {
    this.domain = this.calcDomain(config);
  }

  render(config = null) {
    this.initConfig(config);
  }

}
