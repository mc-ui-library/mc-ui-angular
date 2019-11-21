import {
  Component,
  
  ElementRef,
} from '@angular/core';
import { FieldBaseComponent } from '../field-base.component';
import { MCUIService } from '../../../../mc-ui.service';

@Component({
  selector: 'mc-textarea',
  styleUrls: ['textarea.component.scss', 'textarea.component.theme.scss'],
  templateUrl: './textarea.component.html'
})
export class TextareaComponent extends FieldBaseComponent {

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
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
