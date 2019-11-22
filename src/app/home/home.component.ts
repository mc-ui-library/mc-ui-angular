
import {
  Component,
  ViewContainerRef,
  HostBinding,
} from '@angular/core';
import {
  AppBaseComponent
} from '../index';
import { Router } from '@angular/router';
import {
  MCUIService
} from 'mc-ui-angular';

@Component({
  selector: 'mc-home',
  styleUrls: ['home.component.scss'],
  templateUrl: 'home.component.html'
})
export class HomeComponent extends AppBaseComponent {

  @HostBinding('class.left-menu-minimized') private leftMenuMinimized = false;

  constructor(
      protected er: ViewContainerRef,
      protected service: MCUIService,
      private router: Router
  ) {
      super(er, service);
  }

  onMinimizeLeftMenu(minimized) {
    this.leftMenuMinimized = minimized;
  }
}
