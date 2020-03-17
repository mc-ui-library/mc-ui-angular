import { SharedService } from './../../shared.service';
import { ScrollAsyncComponent } from '../scroll/scroll-async.component';
import { Component, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { GridAction, ScrollDataAction, GridCellInfo } from './../../models';
import { isEmpty } from '../../utils/utils';
import { getAutoColumnWidth } from '../../utils/grid-utils';

@Component({
  selector: 'h2o-grid',
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
  @Input() selectCellByMouseOver = false;

  constructor(protected er: ElementRef, protected service: SharedService, protected cd: ChangeDetectorRef) {
    super(er, service, cd);
  }

  updateColumnWidth() {
    // update column width
    if (this.lastContainerWidth !== this.resizedContainerWidth) {
      // update state
      this.headerData = Object.assign(Object.assign({}, this.headerData), {columns: getAutoColumnWidth(this.headerData.columns, this.resizedContainerWidth, this.columnWidthIsRatio, this.defaultColumnWidth)});
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
      const headerEl = this.el.querySelector('h2o-grid-header');
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