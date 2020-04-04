import { Component, ViewContainerRef } from '@angular/core';
import {
  VizData,
  InputActionEvent,
  InputAction,
  VisualizerAction,
  VisualizerActionEvent
} from 'projects/mc-ui/src/public-api';
import { AppBaseComponent } from './app-base.component';
import { AppService } from './app.service';
import { Company } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AppBaseComponent {
  data: Array<VizData>;
  dailyData: Array<VizData>;

  constructor(protected vcr: ViewContainerRef, private appService: AppService) {
    super(vcr);
  }

  loadCompanies(keyword: string) {
    if (keyword) {
      this.appService
        .getCompanies(keyword)
        .subscribe(data => (this.data = data));
    }
  }

  loadTimeSeries(symbol: string) {
    this.appService
      .getTimeSeries(symbol)
      .subscribe(data => (this.dailyData = data));
  }

  onTextAction(e: InputActionEvent) {
    switch (e.action) {
      case InputAction.CHANGE:
        this.loadCompanies(e.value);
        break;
    }
  }

  onCompanyVizAction(e: VisualizerActionEvent) {
    switch (e.action) {
      case VisualizerAction.SELECT_ITEM:
        const data: Company = e.data;
        this.loadTimeSeries(data.symbol);
        break;
    }
  }
}
