import {
  Component,
  Input,
  ElementRef,
  HostBinding,
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

  @Input() tpl;
  @Input() data = {};
  @Input() idField = 'id';
  @Input() nameField = 'name';
  @Input() hasCheckBox = false;
  @Input() hasDeleteButton = false;

  @HostBinding('style.height') @Input() height = '45px';
  @HostBinding('style.lineHeight') @Input() lineHeight = '43px';
  @HostBinding('class.selected') @Input() selected = false;
  @HostBinding('class.is-scroll-page-item') @Input() isScrollPageItem = false;
  @HostBinding('class.is-first-page-item') @Input() isFirstPageItem = false;
  @HostBinding('class.is-last-page-item') @Input() isLastPageItem = false;
  @HostBinding('class.horizontal') @Input() horizontal = false;

  @HostListener('click', ['$event'])
  onPress(e: any) {
    if (!this.hasCheckBox) {
      this.selected = true;
      this.emitSelectAction(e);
    }
  }

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  emitSelectAction(e) {
    this.action.emit({ target: this, action: this.selected ? 'select-item' : 'unselect-item', event: e, selected: this.selected, data: this.data });
  }

  onChangeCheckbox(e) {
    this.selected = e.target.checked;
    this.emitSelectAction(e);
  }
}
