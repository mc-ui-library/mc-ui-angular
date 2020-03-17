import { GridBodyData, GridAction, GridCellInfo, Column } from './../../models';
import { BaseComponent } from '../base.component';
import { Component, ElementRef, Input, HostListener, HostBinding } from '@angular/core';
import { findParentDom } from '../../utils/utils';

@Component({
  selector: 'mc-grid-body',
  styleUrls: ['grid-body.component.scss'],
  templateUrl: './grid-body.component.html'
})

// TODO: cell can have a border, cell border should be a 1px transparent. It needs to be calculated for row height.
export class GridBodyComponent extends BaseComponent {
  private lastWidth = 0;

  // All the values for the template should be managed by state since it should be assigned at once to avoid multiple rendering(change detection)
  state = {
    gridAction: GridAction,
    idField: 'id',
    tpls: {},
    rowHeight: 44,
    bodyData: [],
    columns: [],
    start: 0
  };

  @Input() private rowHeight = 44;
  @Input() private idField = 'id';
  @Input() private tpls: any = {};
  @Input() selectCellByMouseOver = true;

  @HostBinding('class.is-loading') @Input() isLoading = false;

  // selectedCell is managed seperatly from state since if it is in the state, we need to manage the 'selected' state manually. That is more expensive than using change detection.
  @Input() selectedCell: GridCellInfo;

  @Input()
  set data(value: GridBodyData) {
    if (value) {
      // console.warn('pageData', value);
      // this is used for the rendering cell, it should be on the top;
      this.state = {
        gridAction: GridAction,
        idField: this.idField,
        tpls: this.tpls,
        rowHeight: this.rowHeight,
        start: value.start || 0,
        columns: this.state.columns !== value.columns ? value.columns : this.state.columns,
        bodyData: this.state.bodyData !== value.data ? value.data : this.state.bodyData
      };
      // check size after body rendered
      if (this.rendered) {
        setTimeout(() => this.checkSize());
      }
      this.isLoading = false;
    }
  }

  @HostListener('click', ['$event'])
  onPress(e: any) {
    const el = findParentDom(e.target, '.grid-body--row--cell');
    this.selectCell(e, el);
  }

  @HostListener('mouseover', ['$event'])
  onMouseover(e: MouseEvent) {
    if (this.selectCellByMouseOver) {
      const el = findParentDom(e.target, '.grid-body--row--cell');
      this.selectCell(e, el, GridAction.MOUSEOVER_CELL);
    }
  }

  constructor(protected er: ElementRef) {
    super(er);
  }

  afterRenderCmp() {
    this.checkSize();
  }

  selectCell(event, el: HTMLElement, action = '') {
    if (el) {
      const dataset = el.dataset;
      action = action || dataset.action;
      switch (dataset.action) {
        case GridAction.SELECT_CELL:
          if (!el.classList.contains('unselectable')) {
            const rowIndex = +dataset.rowindex;
            const cellIndex = +dataset.cellindex;
            const field = dataset.field;
            const rowData = this.state.bodyData[rowIndex - this.state.start];
            const cellData = rowData ? rowData[field] : null;
            let selectedCell: GridCellInfo = null;
            if (action !== GridAction.MOUSEOVER_CELL) {
              selectedCell = {
                row: rowIndex,
                col: cellIndex,
                data: cellData
              };
            }
            this.action.emit({
              event,
              el,
              action,
              target: this,
              id: dataset.id,
              rowIndex,
              cellIndex,
              field,
              rowData,
              cellData,
              selectedCell
            });
          }
          break;
      }
    }
  }

  getGridRowClassName(rowIndex: number, row: any) {
    const cls = ['grid-body--row'];
    if (rowIndex + this.state.start === 0) {
      cls.push('is-first-row');
    }
    cls.push((rowIndex + this.state.start) % 2 ? 'grid-body--row-odd' : 'grid-body--row-even');
    if (row.__meta__ && row.__meta__.__row__ && row.__meta__.__row__.class) {
      cls.push(row.__meta__.__row__.class);
    }
    cls.push(...Array.from(this.theme).map(t => t + '-row'));
    return cls.join(' ');
  }

  getGridCellClassName(rowIndex: number, colIndex: number, column: Column) {
    const cls = ['grid-body--row--cell'];
    const selectedCell = this.selectedCell;
    if (column.align) {
      cls.push('align-' + column.align.toLowerCase());
    }
    if (column.selectable === false) {
      cls.push('unselectable');
    }
    if (selectedCell && selectedCell.row === rowIndex + this.state.start && selectedCell.col === colIndex) {
      cls.push('selected');
    }
    if (column.class) {
      cls.push(column.class);
    }
    cls.push(...Array.from(this.theme).map(t => t + '-cell'));
    return cls.join(' ');
  }

  getTplContext(row: any, column: Column, rowIndex: number, colIndex: number) {
    return {
      $implicit: row,
      column: column,
      rowIndex: rowIndex + this.state.start,
      cellData: row[column.field],
      cellMetaData: row.__meta__ ? row.__meta__[column.field] : null,
      colIndex,
      rowCount: this.state.bodyData.length,
      colCount: this.state.columns.length
    };
  }

  getTitle(field, row) {
    const meta = row.__meta__ && row.__meta__[field] ? row.__meta__[field] : {};
    const title = meta.title || row[field];
    return typeof title === 'string' ? title : '';
  }

  checkSize() {
    // emit width for prevent x scroll
    const width = this.el.querySelector('.grid-body').clientWidth;
    if (width && this.lastWidth !== width) {
      this.lastWidth = width;
      this.action.emit({ action: GridAction.UPDATE_WIDTH, target: this, width });
    }
  }
}
