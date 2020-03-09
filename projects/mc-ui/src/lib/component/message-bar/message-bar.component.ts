import {
  Component,

  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';

@Component({
  selector: 'mc-message-bar',
  styleUrls: ['message-bar.component.scss'],
  templateUrl: 'message-bar.component.html'
})

export class MessageBarComponent extends BaseComponent {

  @Input() message = '';

  @Output() hide: EventEmitter <any> = new EventEmitter();

  constructor(protected er: ElementRef) {
    super(er);
  }

  onPressCloseButton(e: any) {
    this.hide.emit(e);
  }
}
