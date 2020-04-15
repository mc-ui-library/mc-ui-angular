import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {
  VisualizerActionEvent,
  VisualizerConfig,
  VisualizerType,
  VisualizerAction
} from '../../../shared.models';
import {
  renderLines, renderBoxplots
} from '../../../utils/viz-utils';

interface State {
  axisConfig: VisualizerConfig;
}

@Component({
  selector: 'mc-boxplot',
  styleUrls: ['boxplot.component.scss'],
  templateUrl: 'boxplot.component.html'
})
export class BoxplotComponent extends BaseComponent {

  defaultState: State = {
    axisConfig: null
  };

  defaultConfig: VisualizerConfig = {
    type: VisualizerType.BOXPLOT,
    boxplotConfig: {
      boxplotField: {
        min: 'Low',
        max: 'High',
        start: 'Open',
        end: 'Close'
      }
    },
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

  state: State;

  _config: VisualizerConfig;

  @Output() action = new EventEmitter<VisualizerActionEvent>();

  constructor(protected er: ElementRef) {
    super(er);
  }

  applyState(config: VisualizerConfig) {
    this.setState({ axisConfig: config });
  }

  onAxisAction(e: VisualizerActionEvent) {
    switch (e.action) {
      case VisualizerAction.RENDERED:
        renderBoxplots(e.config, e.renderInfo);
        break;
    }
  }
}
