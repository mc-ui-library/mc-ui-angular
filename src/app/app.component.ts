import { Component,  ViewContainerRef } from '@angular/core';
import { MCUIService } from 'projects/mc-ui/src/public-api';
import { AppBaseComponent } from './app-base.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AppBaseComponent {

  constructor(protected vr: ViewContainerRef, private service: MCUIService) {
    super(vr);
    this.subscriptions = this.service.message.subscribe(msg => {
      if (msg.to === 'app') {
        switch (msg.action) {
          case 'error':
            this.showMessage(msg.data.message);
            break;
        }
      }
    });
  }

  showMessage(message) {
  }

}
