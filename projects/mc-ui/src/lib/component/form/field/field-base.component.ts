import {
  ElementRef,
  Input,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { BaseComponent } from '../../base.component';

export class FieldBaseComponent extends BaseComponent {

  private _value: any = '';

  valueChangedBy = '';

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
        by: this.valueChangedBy,
        oldValue,
        value: this._value
      });
    }
  }
  get value() {
    return this._value;
  }

  @Output() valueChange: EventEmitter < any > = new EventEmitter();

  constructor(protected er: ElementRef) {
    super(er);
  }

  focus() {}

  onValueChange(e: any) {
    if (JSON.stringify(e.value) !== JSON.stringify(this.value)) {
      const oldValue = this.value;
      this.value = e.value;
      this.valueChange.emit({ target: this, event: e, value: this.value, oldValue });
    }
  }
}
