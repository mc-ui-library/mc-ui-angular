import {
  Component,
  ElementRef,
  Input
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';

@Component({
  selector: 'mc-icon',
  styleUrls: ['icon.component.scss'],
  templateUrl: './icon.component.html'
})

export class IconComponent extends BaseComponent {
  @Input() icon: string;

  constructor(protected er: ElementRef) {
    super(er);
  }

  beforeThemeInit() {
    if (this.icon) {
      this.el.classList.add('icon', 'icon-' + this.icon);
    }
  }
}
