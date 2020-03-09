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
      // overwrite the default config if it has custom values
      this.chartConfig = Object.assign(this.chartConfig, value);
      this.render(this.chartConfig);
    }
  }
  get config() {
    return this.chartConfig;
  }

  constructor(protected er: ElementRef) {
    super(er);
  }

  calcDomain(config) {}

  initConfig(config: any = {}) {
    this.domain = this.calcDomain(config);
  }

  render(config = null) {
    this.initConfig(config);
  }

}
