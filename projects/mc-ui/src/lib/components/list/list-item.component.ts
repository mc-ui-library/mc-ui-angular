import { ListAction, ListItem, ListItemConfig, ListItemActionEvent } from '../../shared.models';
import { Component, Input, HostBinding, HostListener, TemplateRef } from '@angular/core';
import { BaseComponent } from '../base.component';
import { isEmpty } from '../../utils/utils';

interface State {
  tpl: TemplateRef<any>;
  data: ListItem;
  nameField: string;
}

@Component({
  selector: 'mc-list-item',
  styleUrls: ['list-item.component.scss'],
  templateUrl: 'list-item.component.html'
})
export class ListItemComponent extends BaseComponent {
  defaultConfig: ListItemConfig = {
    tpl: null,
    data: {},
    idField: 'id',
    nameField: 'name',
    toggleSelect: false,
    height: 0,
    horizontal: false
  };

  _config: ListItemConfig;

  defaultState: State = {
    tpl: null,
    data: {},
    nameField: 'name'
  };

  state: State;

  @HostBinding('style.height') private height = '';
  @HostBinding('style.lineHeight') private lineHeight = '';
  @HostBinding('class.selected') @Input() selected = false;
  @HostBinding('class.horizontal') private horizontal = false;

  @HostListener('click', ['$event'])
  onPress(e: MouseEvent) {
    // selected state is made by config.
    const selected = this._config.toggleSelect ? !this.selected : true;
    const actionEvent: ListItemActionEvent = {
      target: this,
      action: selected ? ListAction.SELECT_ITEM : ListAction.UNSELECT_ITEM,
      event: e,
      selected: selected,
      data: this.state.data
    };
    this.action.emit(actionEvent);
  }

  applyState(config: ListItemConfig) {
    if (config.height) {
      this.height = config.height + 'px';
      this.lineHeight = config.height + 'px';
    }
    this.horizontal = config.horizontal;
    if (!isEmpty(config.selected)) {
      this.selected = config.selected;
    }
  }
}
