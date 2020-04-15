import { Component, ViewContainerRef } from '@angular/core';
import {
  VisualizerData,
  InputActionEvent,
  InputAction,
  VisualizerAction,
  VisualizerActionEvent,
  VisualizerType
} from 'projects/mc-ui/src/public-api';
import { AppBaseComponent } from './app-base.component';
import { AppService } from './app.service';
import { NasdaqCompany } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AppBaseComponent {
  data: VisualizerData;
  dailyData: VisualizerData;
  barData: VisualizerData;
  lineData: VisualizerData;
  boxplotData: VisualizerData;
  VisualizerType = VisualizerType;

  constructor(protected vcr: ViewContainerRef, private appService: AppService) {
    super(vcr);
  }

  loadCompanies(keyword: string) {
    if (keyword) {
      this.appService
        .getNasdaqCompanies(keyword)
        .subscribe(data => (this.data = data));
    }
  }

  loadDailyDataBySymbol(symbol: string) {
    this.appService
      .getDailyDataBySymbol(symbol)
      .subscribe(data => {
        this.dailyData = {
          columns: data.columns,
          data: data.data.slice(0, 10)
        }
        // Test data
        this.barData = {
          columns: data.columns,
          data: data.data.slice(0, 10)
        };
        this.lineData = {
          columns: data.columns,
          data: data.data.slice(0, 10)
        };
        this.boxplotData = {
          columns: data.columns,
          data: data.data.slice(0, 10)
        };
      });
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
        const data: NasdaqCompany = e.data;
        this.loadDailyDataBySymbol(data.Symbol);
        break;
    }
  }
}
