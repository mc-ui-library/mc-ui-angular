import {
  Component,
  ElementRef
} from '@angular/core';
import {
  FieldBaseComponent
} from '../field-base.component';
import {
  MCUIService
} from '../../../../mc-ui.service';

@Component({
  selector: 'mc-dropdown',
  styleUrls: [
    'dropdown.component.scss'
  ],
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent extends FieldBaseComponent {

  summary = 'select...';

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }
}
