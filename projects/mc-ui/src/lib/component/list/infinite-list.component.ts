import {
  MCUIService
} from '../../mc-ui.service';
import { InfiniteScrollServerComponent } from '../infinite-scroll/infinite-scroll-server.component';
import {
  Component,
  ElementRef,
  
  Input,
} from '@angular/core';

@Component({
  selector: 'mc-infinite-list',
  styleUrls: ['infinite-list.component.scss', 'infinite-list.component.theme.scss'],
  templateUrl: './infinite-list.component.html'
})

export class InfiniteListComponent extends InfiniteScrollServerComponent {

  @Input() itemTpl: any = null;
  @Input() nameField = 'name';

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

}
