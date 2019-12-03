import {
  Component,
  ElementRef
} from '@angular/core';
import {
  MCUIService
} from '../../mc-ui.service';
import {
  BaseComponent
} from '../base.component';

@Component({
  selector: 'mc-icon',
  styleUrls: ['icon.component.scss'],
  templateUrl: './icon.component.html'
})

export class IconComponent extends BaseComponent {
  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }
}
