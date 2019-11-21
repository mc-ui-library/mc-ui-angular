import {
  Component,
  Input,
  
  ElementRef,
  TemplateRef
} from '@angular/core';
import {
  MCUIService
} from '../../mc-ui.service';
import { PopupComponent } from './popup.component';

@Component({
  selector: 'mc-popup-mask',
  styleUrls: ['popup-mask.component.scss', 'popup-mask.component.theme.scss'],
  templateUrl: 'popup-mask.component.html'
})

export class PopupMaskComponent extends PopupComponent {

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  onClickMask() {
    this.visible = false;
  }
}
