import {
  Component,
  Input,
  ElementRef,
} from '@angular/core';
import {
  BaseComponent
} from '../base.component';
import { MCUIService } from '../../mc-ui.service';

@Component({
  selector: 'mc-grid-basic',
  styleUrls: ['grid-basic.component.scss'],
  templateUrl: './grid-basic.component.html'
})

/**
 * This is the same as the grid except it doesn't have the infinity scroll.
 */
export class GridBasicComponent extends BaseComponent {

  // this is for the scroll
  bodyHeight;
  bodyWidth = '100%';

  private _data: any[];

  @Input() rowHeight = 45;
  @Input() columns: any[];
  @Input() headerData: any[];
  @Input() idField = 'id';
  @Input() isLoading = true;
  @Input()
  set data(value: any[]) {
    if (value) {
      if (!this.columns) {
        this.columns = value[0] ? Object.keys(value[0]).map(key => {
          return {
            field: key
          };
        }) : null;
      }
      this._data = value;
      this.isLoading = false;
    }
  }
  get data() {
    return this._data;
  }

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  initCmp() {
    // update column width
    if (this.columns && !this.columns[0].width) {
      const containerWidth = this.el.clientWidth;
      let colWidth = containerWidth / this.columns.length;
      colWidth = colWidth < 100 ? 100 : colWidth;
      this.columns.forEach(column => column.width = colWidth);
    }
  }

  afterRenderCmp() {
    const headerEl = this.el.querySelector('mc-grid-header');
    this.bodyHeight = this.el.clientHeight - headerEl.clientHeight - 2; // header borders
  }

  onAction(e) {
    switch (e.action) {
      case 'update-width':
        this.bodyWidth = e.width + 'px';
        break;
    }
    this.action.emit(e);
  }
}
