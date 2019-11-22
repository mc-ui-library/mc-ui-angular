
import {
  Component,
  ViewContainerRef
} from '@angular/core';
import {
  AppBaseComponent
} from '../../index';
import {
  MCUIService
} from 'mc-ui-angular';

@Component({
  selector: 'mc-example',
  styleUrls: ['example.component.scss'],
  templateUrl: 'example.component.html'
})
export class ExampleComponent extends AppBaseComponent {

  constructor(
      protected er: ViewContainerRef,
      protected service: MCUIService
  ) {
      super(er, service);
  }
}
