import { SortDirection, SortItem, GridAction, GridBodyData, Column, GridHeaderData } from './../../models';
import { BaseComponent } from '../base.component';
import { Component, ElementRef, Input, HostListener } from '@angular/core';
import { findParentDom } from '../../utils/utils';

@Component({
  selector: 'mc-grid-header',
  styleUrls: ['grid-header.component.scss'],
  templateUrl: './grid-header.component.html'
})
export class GridHeaderComponent extends BaseComponent {
  private _data: GridHeaderData;
  private columns: Column[];
  private nextSortDirection = {
    ASC: SortDirection.DESC,
    DESC: SortDirection.ASC
  };
  private atLeastOneSelectedItemRequired = false;

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

  // checking the selected item ids
  selectedItemsMap = new Map<string, Column>();
  fieldColumnMap = new Map<string, Column>()

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
  set data(value: GridHeaderData) {
    if (value) {
      this._data = value;
      this.columns = value.columns;
      this.setSelectedItems(this.columns);
      this.atLeastOneSelectedItemRequired = !!value.atLeastOneSelectedItemRequired;
      this.columns.forEach(column => this.fieldColumnMap.set(column.field, column));
      if (value.rowHeight) {
        this.rowHeight = value.rowHeight;
      }
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
          const field = dataset.field;
          const column = this.fieldColumnMap.get(field)
          if (el.classList.contains('is-sortable')) {
            let dir = SortDirection.ASC;
            if (this.sortItem.fieldName === field) {
              dir = this.nextSortDirection[this.sortItem.direction];
            }
            this.sortItem = {
              fieldName: field,
              direction: dir
            };
            this.action.emit({ event: e, el, action: GridAction.SORT, column, target: this, sort: this.sortItem });
          }
          if(!el.classList.contains('unselectable')) {
            if (this.selectedItemsMap.has(field)) {
              if (this.unselectItem(field)) {
                this.action.emit({ event: e, el, action: GridAction.SELECT_COLUMN, column, selectedColumns: this.getSelectedItems(), target: this });
              }
            } else {
              this.selectItem(field, column);
              this.action.emit({ event: e, el, action: GridAction.SELECT_COLUMN, column, selectedColumns: this.getSelectedItems(), target: this });
            }
          }
          break;
      }
    }
  }

  constructor(protected er: ElementRef) {
    super(er);
  }

  setSelectedItems(columns: Column[]) {
    const selectedColumns = columns.filter(column => column.selected);
    const selectedItemsMap = new Map();
    selectedColumns.forEach(d => selectedItemsMap.set(d.field, d));
    this.selectedItemsMap = selectedItemsMap;
  }

  getSelectedItems() {
    const items = [];
    this.selectedItemsMap.forEach(value => items.push(value));
    return items;
  }

  isSelected(item: any) {
    return this.selectedItemsMap.has('' + item.field);
  }

  selectItem(id: string, item) {
    this.selectedItemsMap.set(id, item);
  }

  unselectItem(id: string) {
    if (this.atLeastOneSelectedItemRequired && this.selectedItemsMap.size === 1) {
      return false;
    }
    this.selectedItemsMap.delete(id);
    return true;
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
          return Object.assign({
            name: column.name || column.field,
            isLastRow: true,
            isFirstRow: true,
            isFirstCol: i === 0,
            isLastCol: i === lastColIndex
          }, column);
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
          cell = Object.assign(cell, column);
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
          } else {
            cell.sort = null;
            cell.field = null;
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

  getGridRowClassName(row: any) {
    const cls = ['grid-header--row'];
    return cls.join(' ');
  }

  getGridCellClassName(cell: any) {
    const cls = ['grid-header--row--cell'];
    if (cell.isFirstRow) {
      cls.push('is-first-row');
    }
    if (cell.isLastRow) {
      cls.push('is-last-row');
    }
    if (cell.isFirstCol) {
      cls.push('is-first-col');
    }
    if (cell.isLastCol) {
      cls.push('is-last-col');
    }
    if (cell.sort) {
      cls.push('is-sortable');
    }
    if (cell.selectableHeader === false) {
      cls.push('unselectable');
    }
    if (this.selectedItemsMap.get(cell.field)) {
      cls.push('selected');
    }
    if (cell.align) {
      cls.push('align-' + cell.align.toLowerCase());
    }
    if (cell.class) {
      cls.push(cell.class);
    }
    return cls.join(' ');
  }

  getGridCellContentClassName(cell: any) {
    const cls = ['grid-header--row--cell--content'];
    if (cell.class) {
      const classes = cell.class.split(' ');
      classes.forEach(c => {
        if (c) {
          cls.push(c + '--content');
        }
      });
    }
    return cls.join(' ');
  }
}
