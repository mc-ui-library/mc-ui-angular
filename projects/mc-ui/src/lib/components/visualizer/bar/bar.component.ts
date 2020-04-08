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
  VisualizerAction,
  VisualizerRenderInfo
} from '../../../shared.models';
import {
  renderChartContainer,
  getAxisSize,
  renderAxis,
  renderGrid,
  getMinMaxMapByField
} from '../../../utils/viz-utils';
import * as d3 from 'd3';

@Component({
  selector: 'mc-bar',
  styleUrls: ['bar.component.scss'],
  template: ''
})
export class BarComponent extends BaseComponent {

  defaultConfig: VisualizerConfig = {
    type: VisualizerType.VERTICAL_BAR,
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

  render(config: VisualizerConfig, renderInfo: VisualizerRenderInfo) {

  }

  onAxisAction(e: VisualizerActionEvent) {
    switch (e.action) {
      case VisualizerAction.RENDERED:
        this.render(e.config, e.renderInfo);
        break;
    }
  }
}
