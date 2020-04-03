import { BaseComponent } from '../../../base.component';
import {
  Component,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  InputType,
  TextConfig,
  InputActionEvent,
  InputAction
} from './../../../../shared.models';

interface State {
  type: InputType;
  name: string;
  value: string;
  placeholder: string;
}

@Component({
  selector: 'mc-text',
  styleUrls: ['text.component.scss'],
  templateUrl: './text.component.html'
})
export class TextComponent extends BaseComponent {
  defaultConfig: TextConfig = {
    type: InputType.text,
    name: 'text',
    value: '',
    placeholder: 'text'
  };

  _config: TextConfig;

  defaultState: State = {
    type: InputType.text,
    name: '',
    value: '',
    placeholder: ''
  };

  @ViewChild('inputEr') private inputEr: ElementRef;

  @Output() action = new EventEmitter<InputActionEvent>();

  constructor(protected er: ElementRef) {
    super(er);
  }

  applyConfig(config: TextConfig) {
    if (!config.placeholder) {
      config.placeholder = config.name;
    }
  }

  afterRenderCmp() {
    const el = this.inputEr.nativeElement;
    this.subscriptions = fromEvent(el, 'keyup')
      .pipe(debounceTime(300))
      .subscribe((e: KeyboardEvent) => this.onKeyUp(e));
  }

  onKeyUp(e: KeyboardEvent) {
    const inputEl = e.target as HTMLInputElement;
    const value = inputEl.value;
    if (value !== this._config.value) {
      const oldValue = this._config.value;
      this._config.value = value;
      this.action.emit({
        target: this,
        action: InputAction.CHANGE,
        name: this._config.name,
        el: inputEl,
        event: e,
        value,
        oldValue
      });
    }
    this.action.emit({
      target: this,
      action: InputAction.KEY_UP,
      name: this._config.name,
      el: inputEl,
      event: e,
      value
    });
  }
}
