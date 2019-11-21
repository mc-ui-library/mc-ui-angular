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
  selector: 'mc-grid-body',
  styleUrls: ['grid-body.component.scss', 'grid-body.component.theme.scss'],
  templateUrl: './grid-body.component.html'
})

export class GridBodyComponent extends BaseComponent {

  private columnsChangeApplied = false;
  private _data;
  private _columns;
  private lastWidth = 0;

  @Input() rowHeight = 30;
  @Input()
  set columns(value) {
    this._columns = value;
    if (value) {
      this.columnsChangeApplied = false;
    }
  }
  get columns() {
    return this._columns;
  }
  @Input()
  set data(value: any[]) {
    this._data = value;
    if (value && !this.columnsChangeApplied) {
      this.columnsChangeApplied = true;
      // check size after body rendered
      setTimeout(() => this.checkSize());
    }
  }
  get data() {
    return this._data;
  }
  @Input() idField = 'id';

  @Output() action: EventEmitter < any > = new EventEmitter();

  @HostListener('click', ['$event'])
  onPress(e: any) {
    const el = this.util.dom.findParent(e.target, '.grid-body--row--cell');
    if (el) {
      const dataset = el.dataset;
      switch (dataset.action) {
        case 'select-cell':
          this.action.emit({ event: e, el, action: dataset.action, target: this, id: dataset.id, rowIndex: +dataset.rowindex, cellIndex: +dataset.cellindex, field: dataset.field });
          break;
      }
    }
  }

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  afterRenderCmp() {
    this.checkSize();
  }

  checkSize() {
    // emit width for prevent x scroll
    const width = this.el.clientWidth;
    if (width && this.lastWidth !== width) {
      this.lastWidth = width;
      this.action.emit({ action: 'update-width', target: this, width });
    }
  }
}
