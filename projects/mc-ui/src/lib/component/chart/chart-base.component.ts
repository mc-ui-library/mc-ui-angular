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

  @Input()
  set config(value) {
    if (value) {
      this.render(value);
    }
  }

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  render(config = null) {
    if (config) this.initConfig(config);
    if (this.hasAxisX || this.hasAxisY) this.renderAxis(this.data, this.svg, this.size, this.unit);
    if (this.hasLegend) this.renderLegend(this.containerEl, this.legendSeries, this.size, this.unit);
    if (this.axisLabels) this.renderAxisLabel(this.data, this.svg, this.size, this.unit);
    this.renderChart(this.data, this.svg, this.size, this.unit);
    this.addStyle(this.svg);
  }


}
