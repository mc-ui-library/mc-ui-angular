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
  selector: 'mc-list',
  styleUrls: ['list.component.scss'], 
  templateUrl: './list.component.html'
})

export class ListComponent extends BaseComponent {

  private _data: any[];
  private _selectedItems: any[];

  // checking the selected item ids
  selectedItemsMap = new Set();

  @Input() rowHeight = 30;
  @Input() multiSelect = false;
  @Input() 
  set selectedItems(value: any[]) {
    if (value) {
      this.selectedItemsMap = new Set();
      value.forEach(d => this.selectedItemsMap.add(d[this.idField]));
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

  @Output() action: EventEmitter < any > = new EventEmitter();

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  key(index: number, item: any) {
    return item[this.idField];
  }

  selectItem() {}

  unselectItem() {}

  onListItemAction(e) {
    
  }
}
