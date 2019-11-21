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
import {
  MCUIService
} from '../../mc-ui.service';

@Component({
  selector: 'mc-message-bar',
  styleUrls: ['message-bar.component.scss', 'message-bar.component.theme.scss'],
  templateUrl: 'message-bar.component.html'
})

export class MessageBarComponent extends BaseComponent {

  @Input() message = '';

  @Output() hide: EventEmitter <any> = new EventEmitter();

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  onPressCloseButton(e: any) {
    this.hide.emit(e);
  }
}
