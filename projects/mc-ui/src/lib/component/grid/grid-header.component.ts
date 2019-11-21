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
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'mc-grid-header',
  styleUrls: ['grid-header.component.scss', 'grid-header.component.theme.scss'],
  templateUrl: './grid-header.component.html'
})

export class GridHeaderComponent extends BaseComponent {

  @Input() columns: any[];
  /**
   * For headers, 
   * [
   *  [ { name: 'xxx', colspan: 2, rowspan: 1 }, ... ],
   *  [ { name: 'xxx', colspan: 1, rowspan: 1 }, ... ]
   * ]
   */
  @Input() data: any[]; 
  @Input() rowHeight = 30;

  @Output() action: EventEmitter < any > = new EventEmitter();

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  initCmp() {
    if (!this.data) {
      // generate header data
      // TODO: update column width for colspan
      this.data = [this.columns.map(column => { return { id: column.field, name: column.name || column.field, tpl: column.headerTpl, width: column.width };})];
    }
  }
}
