import { ListAction } from './../../models';
import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { BaseComponent } from '../base.component';

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
  @Input() toggleSelect = false;

  @HostBinding('style.height') @Input() height = '';
  @HostBinding('style.lineHeight') @Input() lineHeight = '';
  @HostBinding('class.selected') @Input() selected = false;
  @HostBinding('class.horizontal') @Input() horizontal = false;

  @HostListener('click', ['$event'])
  onPress(e: any) {
    this.selected = this.toggleSelect ? !this.selected : true;
    this.emitSelectAction(e);
  }

  emitSelectAction(e) {
    this.action.emit({
      target: this,
      action: this.selected ? ListAction.SELECTED_ITEM : ListAction.UNSELECTED_ITEM,
      event: e,
      selected: this.selected,
      data: this.data
    });
  }
}
