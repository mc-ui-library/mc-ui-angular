import {
  Component,
  ViewContainerRef,
} from '@angular/core';
import {
  AppBaseComponent
} from '../../index';
import {
  Router
} from '@angular/router';
import {
  MCUIService
} from 'mc-ui-angular';
import { HomeService } from '../home.service';

@Component({
  selector: 'mc-home-header',
  styleUrls: ['home-header.component.scss'],
  templateUrl: 'home-header.component.html'
})
export class HomeHeaderComponent extends AppBaseComponent {

  menuData = this.homeService.getMenuList();

  constructor(
    protected er: ViewContainerRef,
    protected service: MCUIService,
    private homeService: HomeService,
    private router: Router,
  ) {
    super(er, service);
  }

  onListAction(e) {
    switch (e.action) {
      case 'select-item':
        this.router.navigate([e.selectedItem.id]);
        break;
    }
  }
}
