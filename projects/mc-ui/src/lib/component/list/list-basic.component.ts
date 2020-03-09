import { ListAction } from './../../models';
import { BaseComponent } from '../base.component';
import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'mc-list-basic',
  styleUrls: ['list-basic.component.scss'],
  templateUrl: './list-basic.component.html'
})
export class ListBasicComponent extends BaseComponent {
  private _data: any[];

  // checking the selected item ids
  selectedItemsMap = new Map();

  @Input() rowHeight: number;
  @Input() multiSelect = false;
  @Input() toggleSelect = false;
  @Input()
  set selectedItems(value: any[]) {
    if (value) {
      const selectedItemsMap = new Map();
      this.hasSelectedItem = value.length > 0;
      value.forEach(d => selectedItemsMap.set('' + d[this.idField], d));
      this.selectedItemsMap = selectedItemsMap;
    }
  }
  get selectedItems() {
    return this.getSelectedItems();
  }
  @Input()
  set data(value: any[]) {
    // convert string array to list data format
    if (value) {
      if (!Array.isArray(value)) {
        value = [value];
      }
      if (typeof value[0] === 'string') {
        value = value.map((d, idx) => ({ id: idx, name: d }));
      }
    }
    this._data = value;
  }
  get data() {
    return this._data;
  }
  // for ListItem
  @Input() itemTpl: any = null;
  @Input() idField = 'id';
  @Input() nameField = 'name';
  @Input() isScrollPage = false;
  @Input() isFirstPage = false;
  @Input() isLastPage = false;
  @HostBinding('class.horizontal') @Input() horizontal = false;
  @HostBinding('class.has-selected-item') @Input() hasSelectedItem = false;

  afterRenderCmp() {
    // if it has the selected item.
    const selectedItems = this.getSelectedItems();
    if (selectedItems.length) {
      this.emitAction(ListAction.SELECTED_ITEM, selectedItems[0]);
    }
  }

  key(index: number, item: any) {
    return item[this.idField];
  }

  getSelectedItems() {
    const items = [];
    this.selectedItemsMap.forEach(value => items.push(value));
    return items;
  }

  selectItem(item) {
    // TODO: check the list is rerendered.
    if (!this.multiSelect) {
      this.selectedItemsMap = new Map();
    }
    this.selectedItemsMap.set(item[this.idField] + '', item);
    this.hasSelectedItem = true;
  }

  unselectItem(item) {
    if (this.multiSelect || this.toggleSelect) {
      this.selectedItemsMap.delete(item[this.idField] + '');
      if (this.selectedItemsMap.size === 0) {
        this.hasSelectedItem = false;
      }
    }
  }

  emitAction(actionType, selectedItem, event = null) {
    this.action.emit({ target: this, action: actionType, event, selectedItem, selectedItems: this.getSelectedItems() });
  }

  onListItemAction(e) {
    switch (e.action) {
      case ListAction.UNSELECTED_ITEM:
      case ListAction.SELECTED_ITEM:
        if (e.action === ListAction.SELECTED_ITEM) {
          this.selectItem(e.data);
        } else {
          this.unselectItem(e.data);
        }
        this.emitAction(e.action, e.data, e.event);
        break;
    }
  }
}
