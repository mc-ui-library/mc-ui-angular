import { Component, ViewContainerRef } from '@angular/core';
import { VizData, InputActionEvent, InputAction } from 'projects/mc-ui/src/public-api';
import { AppBaseComponent } from './app-base.component';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AppBaseComponent {

  data: Array<VizData>;

  constructor(protected vcr: ViewContainerRef, private appService: AppService) {
    super(vcr);
  }

  loadCompanies(keyword: string) {
    if (keyword) {
      this.appService.getCompanies(keyword).subscribe(data => this.data = data);
    }
  }

  onTextAction(e: InputActionEvent) {
    switch (e.action) {
      case InputAction.CHANGE:
        this.loadCompanies(e.value);
        break;
    }
  }
}
