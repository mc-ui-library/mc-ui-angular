
import {
  Component,
  ViewContainerRef,
} from '@angular/core';
import {
  AppBaseComponent
} from '../index';

@Component({
  selector: 'mc-home',
  styleUrls: ['home.component.scss'],
  templateUrl: 'home.component.html'
})
export class HomeComponent extends AppBaseComponent {

  constructor(
      protected er: ViewContainerRef,
  ) {
      super(er);
  }
}
