import {
  Component,
  ElementRef,
  Input,
  Output,
  HostListener
} from '@angular/core';
import {
  FieldBaseComponent
} from '../field-base.component';
import {
  MCUIService
} from '../../../../mc-ui.service';
import { PopupListComponent } from '../../../popup/popup-list.component';
import { ScrollData } from '../../../model';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'mc-dropdown',
  styleUrls: [
    'dropdown.component.scss'
  ],
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent extends FieldBaseComponent {

  private popupListCmp: any;

  @Input() emptyText = 'Select...';

  // **** bypass popup list properties ****
  @Input() itemTpl: any;
  @Input() idField = 'id';
  @Input() nameField = 'name';
  @Input() rowHeight = 45;
  @Input() multiSelect = false;
  @Input() selectedItems: any[] = [];
  @Input() data: ScrollData;

  // infinite scroll
  @Input() additionalData: ScrollData;

  @Output() needData: EventEmitter<any> = new EventEmitter();
  // ***************************************

  summary = this.emptyText;

  @HostListener('click', ['$event'])
  onPress(e: any) {
    this.showPopupList();
  }

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  showPopupList() {
    let instance: PopupListComponent = this.popupListCmp ? this.popupListCmp.instance : null;
    if (!this.popupListCmp) {
      // add to root
      this.popupListCmp = this.service.addComponent(PopupListComponent);
      instance = this.popupListCmp.instance;
      instance.data = this.data;
      instance.checkTargetLocation = true;
      instance.itemTpl = this.itemTpl;
      instance.idField = this.idField;
      instance.nameField = this.nameField;
      instance.rowHeight = this.rowHeight;
      instance.multiSelect = this.multiSelect;
      instance.selectedItems = this.selectedItems;
      instance.additionalData = this.additionalData;
      instance.targetEl = this.el;
      this.subscriptions = instance.valueChange.subscribe(e => {
        e.target = this;
        this.valueChange.emit(e);
      });
      this.subscriptions = instance.needData.subscribe(e => {
        e.target = this;
        this.needData.emit(e);
      });
      this.subscriptions = instance.action.subscribe(e => {
        e.target = this;
        this.action.emit(e);
      });
    }
    instance.visible = !instance.visible;
  }

  destroyCmp() {
    if (this.popupListCmp) {
      this.service.removeComponent(this.popupListCmp);
    }
  }
}
