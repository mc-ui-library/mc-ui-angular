import { ScrollAsyncComponent } from '../scroll/scroll-async.component';
import {
  Component,
  Input,
  ElementRef,
} from '@angular/core';
import { MCUIService } from '../../mc-ui.service';

@Component({
  selector: 'mc-grid',
  styleUrls: ['grid.component.scss'],
  templateUrl: './grid.component.html'
})

export class GridComponent extends ScrollAsyncComponent {

  bodyHeight;
  bodyWidth = '100%';

  @Input() columnTpls = {};
  @Input() headerTpls = {};

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  initCmp() {
    // update column width
    if (this.data.columns && !this.data.columns[0].width) {
      const containerWidth = this.el.clientWidth;
      let colWidth = containerWidth / this.data.columns.length;
      colWidth = colWidth < 100 ? 100 : colWidth;
      this.data.columns.forEach(column => column.width = colWidth);
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
