import {
  Component,
  Input,
  EventEmitter,
  ElementRef,
  HostBinding,
  Output,
  HostListener
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';
import {
  MCUIService
} from '../../mc-ui.service';

@Component({
  selector: 'mc-list-item',
  styleUrls: ['list-item.component.scss'],
  templateUrl: 'list-item.component.html'
})

export class ListItemComponent extends BaseComponent {

  @HostListener('click', ['$event'])
  onPress(e: any) {
    if (!this.hasCheckBox) {
      this.selected = true;
      this.emitSelectAction(e);
    }
  }

  @HostBinding('class.selected') @Input() selected = false;
  @HostBinding('style.height') @Input() height = '30px';

  @Input() tpl;
  @Input() data = {};
  @Input() idField = 'id';
  @Input() nameField = 'name';
  @Input() hasCheckBox = false;
  @Input() hasDeleteButton = false;
  
  @Output() action: EventEmitter<any> = new EventEmitter();

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  emitSelectAction(e) {
    this.action.emit({ target: this, action: 'select-list-item', event: e, selected: this.selected, data: this.data });
  }

  onChangeCheckbox(e) {
    this.selected = e.target.checked;
    this.emitSelectAction(e);
  }
}
