import { ScrollAsyncComponent } from '../scroll/scroll-async.component';
import { Component, Input, ElementRef } from '@angular/core';
import { GridAction, ScrollDataAction, GridCellInfo } from './../../models';
import { getAutoColumnWidth } from '../../utils/grid-utils';
import { isEmpty } from '../../utils/utils';
import { MCUIService } from '../../mc-ui.service';

@Component({
  selector: 'mc-grid',
  styleUrls: ['grid.component.scss'],
  templateUrl: './grid.component.html'
})
export class GridComponent extends ScrollAsyncComponent {
  private defaultColumnWidth = 100;
  private lastContainerWidth: number;

  bodyHeight: number;
  bodyWidth = '100%';

  @Input() columnTpls = {};
  @Input() headerTpls = {};
  @Input() columnWidthIsRatio = true;
  @Input() selectedCell: GridCellInfo;

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  updateColumnWidth() {
    // update column width
    if (this.lastContainerWidth !== this.resizedContainerWidth) {
      this.headerData.columns = getAutoColumnWidth(this.headerData.columns, this.resizedContainerWidth, this.columnWidthIsRatio, this.defaultColumnWidth);
      this.lastContainerWidth = this.resizedContainerWidth;
    }
  }

  updateSize() {
    // TODO: page data should be re-bound with grid-body component when resizing window... the bug is it doesn't run grid-body checkSize()
    // get the container size
    super.updateSize();
    this.updateColumnWidth();
    setTimeout(() => {
      this.el.style.height = '100%';
      const headerEl = this.el.querySelector('mc-grid-header');
      const headerHeight = headerEl.clientHeight;
      const bodyHeight = this.el.clientHeight - headerHeight;
      this.bodyHeight = bodyHeight - 2;
      if (!isEmpty(this.rowCount)) {
        const dataHeight = !this.rowCount ? this.rowHeight : this.rowHeight * this.rowCount;
        if (bodyHeight > dataHeight) {
          this.bodyHeight = dataHeight + 2;
          this.el.style.height = 'auto';
        }
      }
      setTimeout(() => this.scrollCmp.updateState(true));
    });
  }

  onAction(e) {
    const action: GridAction = e.action;
    switch (action) {
      // TODO: when the grid is not auto width, we need to take care the body width.
      // case GridAction.UPDATE_WIDTH:
      //   if (this.bodyWidth !== e.width + 'px') {
      //     this.bodyWidth = e.width + 'px';
      //   }
      //   break;
      case GridAction.SELECT_CELL:
        this.selectedCell = e.selectedCell;
        this.action.emit(e);
        break;
      case GridAction.SORT:
        this.sortItem = e.sort;
        this.neededPageIndex = 0;
        this.emitNeedData(ScrollDataAction.SORT, 0);
        break;
      default:
        this.action.emit(e);
        break;
    }
  }
}
