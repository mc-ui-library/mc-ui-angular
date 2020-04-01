import { ListAction, ListItem, ListConfig, ListItemActionEvent, ListActionEvent } from '../../shared.models';
import { BaseComponent } from '../base.component';
import { Component, HostBinding, Input, TemplateRef } from '@angular/core';

interface State {
  data: Array<ListItem>;
  selectedItemsMap: Map<string, any>;
}

@Component({
  selector: 'mc-list',
  styleUrls: ['list.component.scss'],
  templateUrl: './list.component.html'
})
export class ListComponent extends BaseComponent {
  private _selectedItems: Array<ListItem> = [];
  private _data: Array<ListItem> = [];

  defaultState: State = {
    data: [],
    selectedItemsMap: new Map<string, any>()
  };

  state: State;

  defaultConfig: ListConfig = {
    rowHeight: 0,
    multiSelect: false,
    toggleSelect: false,
    itemTpl: null,
    idField: 'id',
    nameField: 'name',
    horizontal: false
  };

  _config: ListConfig;

  @Input()
  set selectedItems(selectedItems: Array<ListItem>) {
    if (selectedItems) {
      const idField = this._config.idField;
      const selectedItemsMap = new Map();
      this.hasSelectedItem = selectedItems.length > 0;
      selectedItems.forEach(d => selectedItemsMap.set('' + d[idField], d));
      this.setState({ selectedItemsMap });
      this._selectedItems = selectedItems;
    }
  }
  get selectedItems() {
    return this._selectedItems;
  }

  @Input()
  set data(data: Array<ListItem>) {
    if (data) {
      this.setState({ data });
      this._data = data;
    }
  }
  get data() {
    return this._data;
  }

  @HostBinding('class.horizontal') private horizontal = false;
  @HostBinding('class.has-selected-item') private hasSelectedItem = false;

  afterRenderCmp() {
    // if it has the selected item.
    if (this.selectedItems.length) {
      this.emitAction(ListAction.SELECT_ITEM, this.selectedItems[0]);
    }
  }

  applyState(config: ListConfig) {
    this.horizontal = config.horizontal;
    this.selectedItems = config.selectedItems;
  }

  getStringId(data: ListItem) {
    return '' + data[this._config.idField];
  }

  getItemThemes(data: ListItem) {
    const themes = [...this._config.themes];
    if (data.theme) {
      themes.push(data.theme);
    }
    return themes;
  }

  getSelectedItems() {
    const items: Array<ListItem> = [];
    this.state.selectedItemsMap.forEach(value => items.push(value));
    return items;
  }

  selectItem(item) {
    const config = this._config;
    let selectedItems = this.selectedItems.concat();
    if (!config.multiSelect) {
      selectedItems = [];
    }
    selectedItems.push(item);
    this.selectedItems = selectedItems;
  }

  unselectItem(item) {
    const config = this._config;
    if (config.multiSelect || config.toggleSelect) {
      const idField = config.idField;
      this.selectedItems = this.selectedItems.filter(d => d[idField] !== item[idField]);
    }
  }

  emitAction(actionType: ListAction, selectedItem: ListItem, event = null) {
    const action: ListActionEvent = {
      target: this,
      action: actionType,
      event,
      selectedItem,
      selectedItems: this.getSelectedItems()
    };
    this.action.emit(action);
  }

  onListItemAction(e: ListItemActionEvent) {
    switch (e.action) {
      case ListAction.UNSELECT_ITEM:
      case ListAction.SELECT_ITEM:
        if (e.action === ListAction.SELECT_ITEM) {
          this.selectItem(e.data);
        } else {
          this.unselectItem(e.data);
        }
        this.emitAction(e.action, e.data, e.event);
        break;
    }
  }
}
