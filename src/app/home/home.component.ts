
import {
  Component,
  ViewContainerRef,
  HostBinding,
} from '@angular/core';
import {
  AppBaseComponent
} from '../index';
import {
  MCUIService
} from 'mc-ui-angular';

@Component({
  selector: 'mc-home',
  styleUrls: ['home.component.scss'],
  templateUrl: 'home.component.html'
})
export class HomeComponent extends AppBaseComponent {

  constructor(
      protected er: ViewContainerRef,
      protected service: MCUIService,
  ) {
      super(er, service);
  }
}
