import {
  ElementRef,
  Input,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { BaseComponent } from '../../base.component';
import { MCUIService } from '../../../mc-ui.service';

export class FieldBaseComponent extends BaseComponent {

  private _value: any = '';

  @HostBinding('class.readonly') @Input() readonly = false;

  @Input() label = '';
  @Input() name: string;
  @Input() type = 'text';
  @Input() validators: any;
  @Input() errorMessage: string;
  @Input() valid = true;
  @Input() rows = 2;
  @Input() placeholder = '';

  @Input()
  set value(value) {
    if (JSON.stringify(this._value) !== JSON.stringify(value)) {
      const oldValue = this._value;
      this._value = value;
      this.valueChange.emit({
        target: this,
        oldValue,
        value: this._value
      });
    }
  }
  get value() {
    return this._value;
  }

  @Output() valueChange: EventEmitter < any > = new EventEmitter();

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  onValueChange(e: any) {
    this.value = e.value;
  }
}
