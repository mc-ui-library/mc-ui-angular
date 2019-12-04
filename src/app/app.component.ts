import { Component,  ViewContainerRef } from '@angular/core';
import { MCUIService } from 'projects/mc-ui/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(protected vr: ViewContainerRef, private service: MCUIService) {
    this.service.message.subscribe(msg => {
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
