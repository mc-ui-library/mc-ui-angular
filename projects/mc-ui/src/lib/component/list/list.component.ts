import {
  MCUIService
} from '../../mc-ui.service';
import { ScrollAsyncComponent } from '../scroll/scroll-async.component';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ListBasicComponent } from './list-basic.component';

@Component({
  selector: 'mc-list',
  styleUrls: ['list.component.scss'],
  templateUrl: './list.component.html'
})

export class ListComponent extends ScrollAsyncComponent {

  @ViewChild('listBasic1Cmp', {static: false}) listBasic1Cmp: ListBasicComponent;
  @ViewChild('listBasic2Cmp', {static: false}) listBasic2Cmp: ListBasicComponent;

  @Input() itemTpl: any;
  @Input() nameField: string;
  @Input() multiSelect = false;
  @Input() delete = false;
  @Input() selectedItems: any[];

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  unselectItem(item) {
    this.listBasic1Cmp.unselectItem(item);
    this.listBasic2Cmp.unselectItem(item);
  }
}
