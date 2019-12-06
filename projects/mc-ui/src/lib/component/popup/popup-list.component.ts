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
import { InputComponent } from '../form/field/input/input.component';

@Component({
  selector: 'mc-popup-list',
  styleUrls: ['popup.component.scss', 'popup-list.component.scss'],
  templateUrl: 'popup-list.component.html'
})

export class PopupListComponent extends PopupComponent {

  private filterDebounce;
  private keyword = '';

  private _data: ScrollData;

  listData: any;
  adjustedListHeight = 300;
  // for displaying the selections.
  popupSelectedItems: any[] = [];
  listSelectedItems: any[] = [];
  lastSelectedName = '';
  lastSelectedItem;

  @ViewChild('listCmp', {static: false}) listCmp: ListComponent;
  @ViewChild('inputCmp1', { static: false }) inputCmp1: InputComponent;
  @ViewChild('inputCmp2', { static: false }) inputCmp2: InputComponent;

  @Input() listHeight = 300;
  // list properties
  @Input() itemTpl: any;
  @Input() idField: string;
  @Input() nameField: string;
  @Input() rowHeight = 45;
  @Input() multiSelect = false;
  // read only
  @Input()
  set selectedItems(value) {
    if (value) {
      this.popupSelectedItems = value.concat();
      this.listSelectedItems = value.concat();
      this.lastSelectedItem = value.length ? value[0] : null;
    }
  }
  @Input()
  set data(value: ScrollData) {
    this.adjustedListHeight = this.listHeight;
    // input only
    this._data = value;
    // console.log('update popup list data', value);
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
  @Input() startFrom: 'overlap' = 'overlap';

  @Output() needData: EventEmitter<any> = new EventEmitter();

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
    this.filterDebounce = this.util.debounce(this.filter, 300, this);
  }

  getInputCmp() {
    return this.indicatorLocation[0] === 't' ? this.inputCmp1 : this.inputCmp2;
  }

  show() {
    // init filter
    if (this.keyword) {
      this.filter('');
    }
    this.updateLastSelectedItemName();
    super.show();
    setTimeout(() => {
      // focus
      const inputCmp = this.getInputCmp();
      inputCmp.focus();
    });
  }

  filter(keyword) {
    if (keyword !== this.keyword) {
      this.keyword = keyword;
      // it can assign 2 times but it is the same value, so it is not infinity loop.
      this.lastSelectedName = keyword;
      this.needData.emit({
        target: this,
        action: 'filter',
        keyword
      });
    }
  }

  updateLastSelectedItemName() {
    this.lastSelectedName = this.lastSelectedItem ? this.lastSelectedItem[this.nameField] : '';
  }

  onValueChange(e) {
    // console.log('valueChange', e);
    if (e.by === 'keyboard') {
      this.filterDebounce(e.value);
    }
  }

  onClickUnselectButton(item) {
    this.listCmp.unselectItem(item);
  }

  onListAction(e) {
    switch (e.action) {
      case 'unselect-item':
      case 'select-item':
        // for display the selections.
        this.popupSelectedItems = e.selectedItems.concat();
        if (!this.multiSelect) {
          this.visible = false;
        }
        this.lastSelectedItem = e.selectedItem;
        break;
      case 'pages-rendered':
        // remove the empty space of the list
        setTimeout(() => {
          if (e.rowCount * e.rowHeight < this.listHeight) {
            this.adjustedListHeight = e.rowCount * e.rowHeight + 2;
          } else {
            this.adjustedListHeight = this.listHeight;
          }
        });
        break;
    }
    e.target = this;
    this.action.emit(e);
  }

  onListNeedData(e) {
    e.target = this;
    this.needData.emit(e);
  }

  onClickListBody() {
    this.visible = false;
  }
}
