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
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

@Component({
  selector: 'mc-list-basic',
  styleUrls: ['list-basic.component.scss'],
  templateUrl: './list-basic.component.html'
})

export class ListBasicComponent extends BaseComponent {

  private _data: any[];
  private _selectedItems: any[];

  // checking the selected item ids
  selectedItemsMap = new Map();

  @Input() rowHeight = 30;
  @Input() multiSelect = false;
  @Input()
  set selectedItems(value: any[]) {
    if (value) {
      this.selectedItemsMap = new Map();
      value.forEach(d => this.selectedItemsMap.set('' + d[this.idField], d));
    }
  }
  get selectedItems() {
    return this._selectedItems;
  }
  @Input() delete = false;
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

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  key(index: number, item: any) {
    return item[this.idField];
  }

  selectItem(item) {
    // TODO: check the list is rerendered.
    this.selectedItemsMap.set(item[this.idField] + '', item);
  }

  unselectItem(item) {
    // TODO: check the list is rerendered.
    this.selectedItemsMap.delete(item[this.idField] + '');
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
        e.target = this;
        e.selectedItems = this.selectedItemsMap.values();
        this.action.emit(e);
        break;
    }
  }
}
