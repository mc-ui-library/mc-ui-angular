import {
  Component,
  ElementRef
} from '@angular/core';
import {
  FieldBaseComponent
} from '../field-base.component';

@Component({
  selector: 'mc-input',
  styleUrls: [
    'input.component.scss'
  ],
  templateUrl: './input.component.html'
})
export class InputComponent extends FieldBaseComponent {

  private inputEl: HTMLInputElement;

  constructor(protected er: ElementRef) {
    super(er);
  }

  focus(select = true) {
    this.inputEl = this.inputEl || this.el.querySelector('.input--input');
    this.inputEl.focus();
    if (select) {
      this.inputEl.select();
    }
  }

  onKeyUp(e) {
    // recommend strong typing, weak -> e.event.target
    this.valueChangedBy = 'keyboard';
    this.value = e.target.value;
    this.valueChangedBy = '';
  }
}
