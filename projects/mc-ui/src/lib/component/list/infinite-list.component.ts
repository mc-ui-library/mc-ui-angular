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
  styleUrls: ['infinite-list.component.scss'],
  templateUrl: './infinite-list.component.html'
})

export class InfiniteListComponent extends InfiniteScrollServerComponent {

  @Input() itemTpl: any;
  @Input() nameField: string;
  @Input() multiSelect = false;
  @Input() delete = false;

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

}
