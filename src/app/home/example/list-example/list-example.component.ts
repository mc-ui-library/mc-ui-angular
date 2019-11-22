import {
  Component,
  ViewContainerRef
} from '@angular/core';
import {
  AppBaseComponent
} from 'src/app/app-base.component';
import {
  MCUIService
} from 'mc-ui-angular';
import { HomeService } from '../../home.service';

@Component({
  selector: 'mc-list-example',
  templateUrl: './list-example.component.html',
  styleUrls: ['./list-example.component.scss']
})
export class ListExampleComponent extends AppBaseComponent {

  data = this.homeService.getUserListMock().data;

  constructor(
    protected er: ViewContainerRef,
    protected service: MCUIService,
    private homeService: HomeService
  ) {
    super(er, service);
  }
}
