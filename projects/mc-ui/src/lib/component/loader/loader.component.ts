import {
  Component,
  
  ElementRef,
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';
import {
  MCUIService
} from '../../mc-ui.service';

@Component({
  selector: 'mc-loader',
  styleUrls: ['loader.component.scss'],
  templateUrl: 'loader.component.html'
})

export class LoaderComponent extends BaseComponent {

  theme = 'ring';

  loader = 'ring';

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  initCmp() {
    this.loader = Array.isArray(this.theme) ? this.theme[0] : this.theme;
  }
}
