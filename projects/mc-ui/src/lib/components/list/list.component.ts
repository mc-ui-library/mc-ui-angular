import {
  ListAction,
  ListItem,
  ListItemConfig,
  ListConfig,
  ListItemActionEvent,
  ListActionEvent
} from '../../mc-ui.models';
import { BaseComponent } from '../base.component';
import { Component, HostBinding } from '@angular/core';

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
  private selectedItems: any[];

  state: State = {
    data: [],
    selectedItemsMap: null
  };

  _config: ListConfig = {
    rowHeight: 0,
    multiSelect: false,
    toggleSelect: false,
    selectedItems: [],
    data: [],
    itemTpl: null,
    idField: 'id',
    nameField: 'name',
    horizontal: false
  };

  @HostBinding('class.horizontal') private horizontal = false;
  @HostBinding('class.has-selected-item') private hasSelectedItem = false;

  afterRenderCmp() {
    // if it has the selected item.
    if (this.selectedItems.length) {
      this.emitAction(ListAction.SELECT_ITEM, this.selectedItems[0]);
    }
  }

  applyConfig(config: ListConfig) {
    this.selectedItems = config.selectedItems;
    this.horizontal = config.horizontal;
  }

  applyState(config: ListConfig) {
    this.applySelectedItems(config);
  }

  applySelectedItems(config: ListConfig) {
    const idField = config.idField;
    const selectedItemsMap = new Map();
    this.hasSelectedItem = this.selectedItems.length > 0;
    this.selectedItems.forEach(d => selectedItemsMap.set('' + d[idField], d));
    this.setState({ selectedItemsMap });
  }

  getListItemConfig(data: ListItem): ListItemConfig {
    const config = this._config;
    const selected = this.state.selectedItemsMap.has('' + data[config.idField]);
    const themes = [...config.themes, data.theme];
    const height = config.rowHeight;
    return {
      data,
      selected,
      themes,
      height,
      idField: config.idField,
      nameField: config.nameField,
      horizontal: config.horizontal,
      toggleSelect: config.toggleSelect,
      tpl: config.itemTpl
    };
  }

  getSelectedItems() {
    const items = [];
    this.state.selectedItemsMap.forEach(value => items.push(value));
    return items;
  }

  selectItem(item) {
    const config = this._config;
    let selectedItems = this.selectedItems;
    if (!config.multiSelect) {
      selectedItems = [];
    }
    selectedItems.push(item);
    this.selectedItems = selectedItems;
    this.applySelectedItems(config);
  }

  unselectItem(item) {
    const config = this._config;
    if (config.multiSelect || config.toggleSelect) {
      const idField = config.idField;
      this.selectedItems = this.selectedItems.filter(d => d[idField] !== item[idField]);
      this.applySelectedItems(config);
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
