import { Icon, ComponentTheme } from './../../shared.models';
import {
  SortDirection,
  SortItem,
  GridAction,
  Column,
  GridHeaderCell,
  GridHeaderConfig,
  GridHeaderActionEvent
} from '../../shared.models';
import { BaseComponent } from '../base.component';
import { Component, ElementRef, Input, HostListener } from '@angular/core';
import { findParentDom } from '../../utils/dom-utils';

interface State {
  data: Array<Array<GridHeaderCell>>;
  rowHeight: number;
  tpls: any;
  sortItem: SortItem;
  selectedColumnsMap: Map<string, Column>;
}

@Component({
  selector: 'mc-grid-header',
  styleUrls: ['grid-header.component.scss'],
  templateUrl: './grid-header.component.html'
})
export class GridHeaderComponent extends BaseComponent {
  private _columns: Array<Column>;

  private nextSortDirection = {
    ASC: SortDirection.DESC,
    DESC: SortDirection.ASC
  };

  Theme = ComponentTheme;
  Icon = Icon;

  GridAction = GridAction;
  SortDirection = SortDirection;

  fieldColumnMap = new Map<string, Column>();

  defaultConfig: GridHeaderConfig = {
    rowHeight: 30,
    tpls: {},
    data: null,
    atLeastOneSelectedColumnRequired: false,
    selectedColumns: [],
    sortItem: {
      fieldName: '',
      direction: SortDirection.ASC
    }
  };

  _config: GridHeaderConfig;

  defaultState: State = {
    data: [],
    rowHeight: 30,
    tpls: {},
    sortItem: {
      fieldName: '',
      direction: SortDirection.ASC
    },
    selectedColumnsMap: new Map<string, Column>()
  };

  state: State;

  @HostListener('click', ['$event'])
  onPress(e: MouseEvent) {
    const el = findParentDom(e.target, '.grid-header--row--cell');
    if (el) {
      const dataset = el.dataset;
      switch (dataset.action) {
        case GridAction.SELECT_CELL:
          const column = this.fieldColumnMap.get(dataset.field);
          if (el.classList.contains('is-sortable')) {
            this.onSort(el, column, e);
          }
          if (!el.classList.contains('unselectable')) {
            this.onSelect(column, el, e);
          }
          break;
      }
    }
  }

  @Input()
  set columns(columns: Array<Column>) {
    if (columns) {
      this._columns = columns;
      columns.forEach(column => this.fieldColumnMap.set(column.field, column));
      if (!this._config.data) {
        this.setState({ data: this.getBasicHeaderData() });
      } else {
        this.setState({ data: this.getHeaderData(this._config.data) });
      }
    }
  }
  get columns() {
    return this._columns;
  }

  constructor(protected er: ElementRef) {
    super(er);
  }

  applyState(config: GridHeaderConfig) {
    if (config.selectedColumns) {
      const selectedColumnsMap = new Map();
      config.selectedColumns.forEach(d => selectedColumnsMap.set(d.field, d));
      this.setState({ selectedColumnsMap });
    }
    this.showHeader();
  }

  showHeader() {
    // for hiding the header before calculating the columns' width.
    setTimeout(() => (this.el.style.visibility = 'visible'));
  }

  getSelectedColumns() {
    const columns = [];
    this.state.selectedColumnsMap.forEach(value => columns.push(value));
    return columns;
  }

  selectColumn(id: string, item) {
    this.state.selectedColumnsMap.set(id, item);
  }

  unselectColumn(id: string) {
    if (this._config.atLeastOneSelectedColumnRequired && this.state.selectedColumnsMap.size === 1) {
      return false;
    }
    this.state.selectedColumnsMap.delete(id);
    return true;
  }

  getBasicHeaderData() {
    const lastColIndex = this.columns.length - 1;
    return [
      this.columns.map((column, i) => {
        if (column.sortDirection) {
          this.state.sortItem = {
            direction: column.sortDirection,
            fieldName: column.field
          };
        }
        return Object.assign(
          {
            name: column.name || column.field,
            isLastRow: true,
            isFirstRow: true,
            isFirstCol: i === 0,
            isLastCol: i === lastColIndex
          },
          column
        );
      })
    ];
  }

  getHeaderData(data: Array<Array<GridHeaderCell>>) {
    const headerData = data.concat();
    const columns = this.columns;
    const lastColIndex = columns.length - 1;
    const rows = [];
    // calc col width
    const lastIndex = headerData.length - 1;
    headerData.forEach((row: any[], r: number) => {
      rows[r] = rows[r] || [];
      let c = 0;
      row.forEach(cell => {
        while (rows[r][c] === -1) {
          c++;
        }
        const column = columns[c];
        cell = Object.assign(cell, column);
        const colspan = cell.colspan || 1;
        const rowspan = cell.rowspan || 1;
        if (r === lastIndex || r + rowspan - 1 === lastIndex) {
          cell.isLastRow = true;
        }
        let width = 0;
        for (let i = 0; i < colspan; i++) {
          width += columns[c + i].width;
        }
        cell.width = width;
        // flag the empty cells
        for (let i = 1; i < rowspan; i++) {
          for (let j = 0; j < colspan; j++) {
            rows[r + i] = rows[r + i] || [];
            rows[r + i][c + j] = -1;
          }
        }
        cell.sort = null;
        cell.field = null;
        if (cell.isLastRow) {
          cell.sort = column.sort;
          cell.field = column.field;
          // if it has the existing sort field, keeps it
          if (column.sortDirection) {
            this.setState({
              sortItem: {
                direction: column.sortDirection,
                fieldName: column.field
              }
            });
          }
        }
        cell.isFirstRow = r === 0;
        cell.isFirstCol = c === 0;
        cell.isLastCol = c === lastColIndex;
        c += colspan;
      });
    });
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
    if (cell.selectableHeader !== true) {
      cls.push('unselectable');
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

  onSort(el: HTMLElement, column: Column, event: MouseEvent = null) {
    let dir = SortDirection.ASC;
    if (this.state.sortItem.fieldName === column.field) {
      dir = this.nextSortDirection[this.state.sortItem.direction];
    }
    const sortItem = {
      fieldName: column.field,
      direction: dir
    };
    this.setState({ sortItem });
    const actionEvent: GridHeaderActionEvent = {
      event,
      el,
      action: GridAction.SORT,
      column,
      target: this,
      sort: this.state.sortItem
    };
    this.action.emit(actionEvent);
  }

  onSelect(column: Column, el: HTMLElement, event: MouseEvent) {
    const field = column.field;
    if (this.state.selectedColumnsMap.has(field)) {
      if (this.unselectColumn(field)) {
        const actionEvent: GridHeaderActionEvent = {
          event,
          el,
          action: GridAction.SELECT_COLUMN,
          column,
          selectedColumns: this.getSelectedColumns(),
          target: this
        };
        this.action.emit(actionEvent);
      }
    } else {
      this.selectColumn(field, column);
      const actionEvent: GridHeaderActionEvent = {
        event,
        el,
        action: GridAction.SELECT_COLUMN,
        column,
        selectedColumns: this.getSelectedColumns(),
        target: this
      };
      this.action.emit(actionEvent);
    }
  }
}
