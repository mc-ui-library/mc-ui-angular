import {
  Component,
  Input,
  
  ElementRef,
  HostBinding,
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';
import {
  MCUIService
} from '../../mc-ui.service';

@Component({
  selector: 'mc-mask',
  styleUrls: ['mask.component.scss'],
  templateUrl: 'mask.component.html'
})

export class MaskComponent extends BaseComponent {

  @HostBinding ('class.visible') @Input() visible = false;
  @HostBinding ('class.transparent') @Input() transparent = false;

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }
}
