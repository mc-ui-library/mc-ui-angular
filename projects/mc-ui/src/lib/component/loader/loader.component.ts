import {
  Component,
  ElementRef,
  Input,
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
  @Input() theme = 'ring';
  loader = Array.isArray(this.theme) ? this.theme[0] : this.theme;

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }
}
