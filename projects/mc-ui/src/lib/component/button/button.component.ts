import {
  Component,
  Input,

  Output,
  ElementRef,
  EventEmitter
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';

@Component({
  selector: 'mc-button',
  styleUrls: ['button.component.scss'],
  templateUrl: 'button.component.html'
})

export class ButtonComponent extends BaseComponent {

  @Input() type = 'button';

  @Output() press: EventEmitter < any > = new EventEmitter();

  constructor(protected er: ElementRef) {
    super(er);
  }

  onClick(e) {
    this.press.emit({
      target: this,
      event: e,
      el: e.target,
      type: this.type
    });
  }

}
