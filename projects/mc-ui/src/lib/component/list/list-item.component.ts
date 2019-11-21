import {
  Component,
  Input,
  
  ElementRef,
  HostBinding
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';
import {
  MCUIService
} from '../../mc-ui.service';

@Component({
  selector: 'mc-list-item',
  styleUrls: ['list-item.component.scss', 'list-item.component.theme.scss'],
  templateUrl: 'list-item.component.html'
})

export class ListItemComponent extends BaseComponent {

  @HostBinding('style.height') @Input() height = '30px';

  @Input() tpl;
  @Input() data = {};
  @Input() idField = 'id';
  @Input() nameField = 'name';
  @Input() hasCheckBox = false;
  @Input() hasDeleteButton = false;

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }
}
