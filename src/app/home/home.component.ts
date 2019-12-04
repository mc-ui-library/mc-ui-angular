
import {
  Component,
  ViewContainerRef,
} from '@angular/core';
import {
  AppBaseComponent
} from '../index';
import { MCUIService } from 'projects/mc-ui/src/public-api';

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
