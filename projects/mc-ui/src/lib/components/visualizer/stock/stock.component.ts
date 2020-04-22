import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {
  VisualizerActionEvent,
  VisualizerConfig,
  VisualizerType,
  VisualizerAction
} from '../../../shared.models';
import {
  renderLines,
  renderRects,
  renderBoxplots,
  updateChartSize
} from '../../../utils/viz-utils';
import { clone } from '../../../utils/data-utils';
import { AxisComponent } from '../axis/axis.component';

interface State {
  mainAxisConfig: VisualizerConfig;
  volumeAxisConfig: VisualizerConfig;
}

@Component({
  selector: 'mc-stock',
  styleUrls: ['stock.component.scss'],
  templateUrl: 'stock.component.html'
})
export class StockComponent extends BaseComponent {
  private mainEvent: VisualizerActionEvent;
  private volumeEvent: VisualizerActionEvent;

  defaultState: State = {
    mainAxisConfig: null,
    volumeAxisConfig: null
  };

  defaultConfig: VisualizerConfig = {
    type: VisualizerType.STOCK,
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
    this.setState({
      mainAxisConfig: clone(
        Object.assign(config, {
          dataFields: ['Low', 'High', 'Open', 'Close'],
          isManualRender: true
        })
      ),
      volumeAxisConfig: clone(
        Object.assign(config, { dataFields: ['Volume'], isManualRender: true })
      )
    });
  }

  renderMain(e: VisualizerActionEvent) {
    const axis: AxisComponent = e.target;
    const renderInfo = axis.render(e.config, e.visualizerSize);
    renderBoxplots(e.config, renderInfo);
    const { svg, unit, size } = renderInfo;
    renderLines(e.config, {
      svg,
      unit: Object.assign(unit, { fields: ['Close'] }),
      size
    });
  }

  renderVolume(e: VisualizerActionEvent) {
    const axis: AxisComponent = e.target;
    const renderInfo = axis.render(e.config, e.visualizerSize);
    renderRects(e.config, renderInfo);
  }

  calcLeftMarginAndRender(
    main: VisualizerActionEvent,
    volume: VisualizerActionEvent
  ) {
    // charts should have the same left margin.
    const marginLeft = Math.max(
      main.visualizerSize.margin.left,
      volume.visualizerSize.margin.left
    );
    main.visualizerSize.margin.left = marginLeft;
    volume.visualizerSize.margin.left = marginLeft;
    main.visualizerSize = updateChartSize(main.visualizerSize);
    volume.visualizerSize = updateChartSize(volume.visualizerSize);
    this.renderMain(main);
    this.renderVolume(volume);
  }

  onAxisAction(e: VisualizerActionEvent, type: string) {
    switch (e.action) {
      case VisualizerAction.BEFORE_RENDER:
        if (type === 'main') {
          this.mainEvent = e;
        } else {
          this.volumeEvent = e;
        }
        break;
    }
    if (this.mainEvent && this.volumeEvent) {
      this.calcLeftMarginAndRender(this.mainEvent, this.volumeEvent);
    }
  }
}
