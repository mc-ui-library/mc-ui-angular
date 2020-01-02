import {
  Component,

  ElementRef,
  Input,
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';

@Component({
  selector: 'mc-loader',
  styleUrls: ['loader.component.scss'],
  templateUrl: 'loader.component.html'
})

export class LoaderComponent extends BaseComponent {
  @Input() theme = 'ring';
  loader = Array.isArray(this.theme) ? this.theme[0] : this.theme;
}
