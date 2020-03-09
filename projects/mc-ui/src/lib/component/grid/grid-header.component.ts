import { SortDirection, SortItem, GridAction, GridBodyData, Column } from './../../models';
import { BaseComponent } from '../base.component';
import { Component, ElementRef, Input, HostListener } from '@angular/core';
import { findParentDom } from '../../utils/dom-utils';

@Component({
  selector: 'mc-grid-header',
  styleUrls: ['grid-header.component.scss'],
  templateUrl: './grid-header.component.html'
})
export class GridHeaderComponent extends BaseComponent {
  private _data: GridBodyData;
  private columns: Column[];
  private nextSortDirection = {
    ASC: SortDirection.DESC,
    DESC: SortDirection.ASC
  };

  // THINK: this may not help multiple change detection since all the values are assigned at once actually even using separate properties.
  state = {
    gridAction: GridAction,
    sortDirection: SortDirection,
    tpls: {},
    headerData: [],
    rowHeight: 30
  };

  sortItem: SortItem = {
    fieldName: '',
    direction: SortDirection.ASC
  };

  @Input() private rowHeight = 30;
  @Input() private tpls = {};
  /**
   * For headers,
   * [
   *  [ { name: 'xxx', colspan: 2, rowspan: 1 }, ... ],
   *  [ { name: 'xxx', colspan: 1, rowspan: 1 }, ... ]
   * ]
   */
  @Input()
  set data(value: GridBodyData) {
    if (value) {
      this._data = value;
      this.columns = value.columns;
      this.state = {
        gridAction: GridAction,
        sortDirection: SortDirection,
        rowHeight: this.rowHeight,
        tpls: this.tpls,
        headerData: this.updateColumnWidth(value.data)
      };
      // for hiding the header before calculating the columns' width.
      setTimeout(() => (this.el.style.visibility = 'visible'));
    }
  }
  get data() {
    return this._data;
  }

  @HostListener('click', ['$event'])
  onPress(e: any) {
    const el = findParentDom(e.target, '.grid-header--row--cell');
    if (el) {
      const dataset = el.dataset;
      switch (dataset.action) {
        case GridAction.SELECT_CELL:
          if (el.classList.contains('is-sortable')) {
            const field = dataset.field;
            let dir = SortDirection.ASC;
            if (this.sortItem.fieldName === field) {
              dir = this.nextSortDirection[this.sortItem.direction];
            }
            this.sortItem = {
              fieldName: field,
              direction: dir
            };
            this.action.emit({ event: e, el, action: GridAction.SORT, target: this, sort: this.sortItem });
          }
          break;
      }
    }
  }

  constructor(protected er: ElementRef) {
    super(er);
  }

  updateColumnWidth(headerData) {
    const lastColIndex = this.columns.length - 1;
    if (!headerData) {
      // generate header data
      headerData = [
        this.columns.map((column, i) => {
          if (column.sortDirection) {
            this.sortItem = {
              direction: column.sortDirection,
              fieldName: column.field
            };
          }
          return {
            field: column.field,
            name: column.name || column.field,
            width: column.width,
            class: column.class,
            isLastRow: true,
            isFirstRow: true,
            isFirstCol: i === 0,
            isLastCol: i === lastColIndex,
            sort: column.sort,
            SortDirection: column.sortDirection
          };
        })
      ];
    } else {
      const rows = [];
      // calc col width
      const lastIndex = headerData.length - 1;
      headerData.forEach((row, r) => {
        rows[r] = rows[r] || [];
        let c = 0;
        row.forEach(cell => {
          while (rows[r][c] === -1) {
            c++;
          }
          const column = this.columns[c];
          const colspan = cell.colspan || 1;
          const rowspan = cell.rowspan || 1;
          if (r === lastIndex || r + rowspan - 1 === lastIndex) {
            cell.isLastRow = true;
          }
          let width = 0;
          for (let i = 0; i < colspan; i++) {
            width += this.columns[c + i].width;
          }
          cell.width = width;
          // flag the empty cells
          for (let i = 1; i < rowspan; i++) {
            for (let j = 0; j < colspan; j++) {
              rows[r + i] = rows[r + i] || [];
              rows[r + i][c + j] = -1;
            }
          }
          cell.class = column.class;
          if (cell.isLastRow) {
            cell.sort = column.sort;
            cell.field = column.field;
            // if it has the existing sort field, keeps it
            if (column.sortDirection && !this.sortItem.fieldName) {
              this.sortItem = {
                direction: column.sortDirection,
                fieldName: column.field
              };
            }
          }
          if (r === 0) {
            cell.isFirstRow = true;
          }
          if (c === 0) {
            cell.isFirstCol = true;
          }
          if (c === lastColIndex) {
            cell.isLastCol = true;
          }
          c += colspan;
        });
      });
    }
    return headerData;
  }
}
