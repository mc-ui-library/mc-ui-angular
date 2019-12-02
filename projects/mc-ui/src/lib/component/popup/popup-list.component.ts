import {
  Component,
  ElementRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MCUIService
} from '../../mc-ui.service';
import { PopupComponent } from './popup.component';
import { EventEmitter } from '@angular/core';
import { ScrollData } from '../model';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'mc-popup-list',
  styleUrls: ['popup.component.scss', 'popup-list.component.scss'],
  templateUrl: 'popup-list.component.html'
})

export class PopupListComponent extends PopupComponent {

  private filterDebounce;
  private keyword;
  private items: any;

  private _data: ScrollData;
  private _selectedItems: any[];

  listData: any;
  listHeight = 300;
  popupSelectedItems = [];

  @ViewChild('listCmp', {static: false}) listCmp: ListComponent;

  // list properties
  @Input() itemTpl: any;
  @Input() idField: string;
  @Input() nameField: string;
  @Input() rowHeight: number;
  @Input() multiSelect = false;
  @Input()
  set selectedItems(value: any[]) {
    if (value) {
      // input only
      this.popupSelectedItems = value.concat();
    }
  }
  get selectedItems() {
    return this._selectedItems;
  }
  @Input()
  set data(value: ScrollData) {
    // input only
    this._data = value;
    // update list for calculating scroll height after updating header height.
    setTimeout(() => this.listData = value);
  }
  get data() {
    return this._data;
  }
  // infinite scroll
  @Input() additionalData: ScrollData;

  // popup
  @Input() height = 350;
  @Input() startFrom: 'start' = 'start';

  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() needData: EventEmitter<any> = new EventEmitter();

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
    this.filterDebounce = this.util.debounce(this.filter, 300, this);
  }

  show() {
    super.show();
  }

  filter(keyword) {
    if (keyword !== this.keyword) {
      this.needData.emit({
        target: this,
        keyword
      });
    }
  }

  onValueChange(e) {
    this.filterDebounce(e.value);
  }

  onClicUnselectButton(item) {
    this.listCmp.unselectItem(item);
  }

  onListAction(e) {
    switch (e.action) {
      case 'unselect-item':
      case 'select-item':
        // update popup selected item
        if (e.action === 'select-item') {
          this.popupSelectedItems.push(e.item);
        } else {
          this.popupSelectedItems = this.popupSelectedItems.filter(d => d[this.idField] + '' !== e.item[this.idField] + '');
        }
        e.target = this;
        this.action.emit(e);
        break;
    }
  }
}
