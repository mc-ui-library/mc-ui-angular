import {
  Component,
  ElementRef,
  Input,
  Output,
} from '@angular/core';
import {
  MCUIService
} from '../../mc-ui.service';
import { PopupComponent } from './popup.component';
import { EventEmitter } from '@angular/core';
import { ScrollData } from '../model';

@Component({
  selector: 'mc-popup-list',
  styleUrls: ['popup.component.scss', 'popup-list.component.scss'],
  templateUrl: 'popup-list.component.html'
})

export class PopupListComponent extends PopupComponent {

  private filterDebounce;
  private keyword;

  listHeight = 300;
  selectedItems = [];

  // list properties
  @Input() itemTpl: any;
  @Input() idField: string;
  @Input() nameField: string;
  @Input() rowHeight: number;
  @Input() multiSelect = false;
  @Input() data: ScrollData;
  // infinite scroll
  @Input() additionalData: ScrollData;

  // need list height
  @Input() height = 350;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() needData: EventEmitter<any> = new EventEmitter();

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
    this.filterDebounce = this.util.debounce(this.filter, 300, this);
  }

  filter(keyword) {
    if (keyword !== this.keyword) {
      this.needData.emit({
        keyword: keyword
      });
    }
  }

  onValueChange(e) {
    this.filterDebounce(e.value);
  }
}
