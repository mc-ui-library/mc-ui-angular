import {
  Component,

  ElementRef,
} from '@angular/core';
import { FieldBaseComponent } from '../field-base.component';

@Component({
  selector: 'mc-textarea',
  styleUrls: ['textarea.component.scss'],
  templateUrl: './textarea.component.html'
})
export class TextareaComponent extends FieldBaseComponent {

  constructor(protected er: ElementRef) {
    super(er);
  }

  onKeyUp(e) {
    // recommend strong typing, weak -> e.event.target
    const value = e.target.value;
    if (value !== this.value) {
      const oldValue = this.value;
      this.value = value;
      this.valueChange.emit({
        target: this,
        event: e,
        value: this.value,
        oldValue
      });
    }
  }
}
