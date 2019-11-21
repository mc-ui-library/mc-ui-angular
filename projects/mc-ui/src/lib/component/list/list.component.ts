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
  styleUrls: ['list.component.scss', 'list.component.theme.scss'], 
  templateUrl: './list.component.html'
})

export class ListComponent extends BaseComponent {

  private _data: any[]

  @Input() itemTpl: any = null;
  @Input() idField = 'id';
  @Input() nameField = 'name';
  @Input() rowHeight = 30;
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

  @Output() action: EventEmitter < any > = new EventEmitter();

  @HostListener('click', ['$event'])
  onPress(e: any) {
    const listItemEl = this.util.dom.findParent(e.target, '.list--item');
    if (listItemEl) {
      const dataset = listItemEl.dataset;
      switch (dataset.action) {
        case 'select-item':
          this.action.emit({ event: e, action: dataset.action, target: this, id: dataset.id });
          break;
      }
    }
  }

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  key(index: number, item: any) {
    return item[this.idField];
  }
}
