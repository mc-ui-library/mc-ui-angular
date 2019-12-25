import {
  MCUIService
} from '../../mc-ui.service';
import {
  BaseComponent
} from '../base.component';
import {
  Component,
  ElementRef,
  Input,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'mc-list-basic',
  styleUrls: ['list-basic.component.scss'],
  templateUrl: './list-basic.component.html'
})

export class ListBasicComponent extends BaseComponent {

  private _data: any[];

  // checking the selected item ids
  selectedItemsMap = new Map();

  @Input() rowHeight = 45; // horizontal ? 100% : rowHeight;
  @Input() multiSelect = false;
  @Input()
  set selectedItems(value: any[]) {
    if (value) {
      this.selectedItemsMap = new Map();
      value.forEach(d => this.selectedItemsMap.set('' + d[this.idField], d));
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
        value = value.map((d, idx) => {
          return { id: idx, name: d};
        });
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
  @Input() hasDelete = false;

  @Input() isLastPage = false;
  @Input() isFirstPage = false;
  @HostBinding('class.is-scroll-page') @Input() isScrollPage = false;
  @HostBinding('class.horizontal') @Input() horizontal = false;
  @HostBinding('style.lineHeight') @Input() horizontalLineHeight = '43px';

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  afterRenderCmp() {
    // if it has the selected item.
    const selectedItems = this.getSelectedItems();
    if (selectedItems.length) {
      this.emitAction('select-item', selectedItems[0]);
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
  }

  unselectItem(item) {
    // TODO: check the list is rerendered.
    if (this.multiSelect) {
      this.selectedItemsMap.delete(item[this.idField] + '');
    }
  }

  emitAction(actionType, selectedItem, event = null) {
    this.action.emit({ target: this, action: actionType, event, selectedItem, selectedItems: this.getSelectedItems() });
  }

  onListItemAction(e) {
    switch (e.action) {
      case 'unselect-item':
      case 'select-item':
        if (e.action === 'select-item') {
          this.selectItem(e.data);
        } else {
          this.unselectItem(e.data);
        }
        this.emitAction(e.action, e.data, e.event);
        break;
    }
  }
}
