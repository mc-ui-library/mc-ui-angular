import { GridRowMeta, GridFieldMeta, GridRowDataMeta, Icon, ComponentTheme } from './../../shared.models';
import { GridAction, GridCellInfo, Column, GridBodyConfig, GridBodyActionEvent } from '../../shared.models';
import { BaseComponent } from '../base.component';
import { Component, ElementRef, HostListener, TemplateRef, Input, ChangeDetectorRef } from '@angular/core';
import { findParentDom } from '../../utils/dom-utils';

/**
 * Row or Cell selection is managed by grid component since selected cell and selected rows are just readonly properties
 */

interface State {
  data: Array<any>;
  rowHeight: number;
  columns: Array<Column>;
  idField: string;
  startRowIndex: number;
  tpls: any;
  hasAccordionRow: boolean;
  selectedCell: GridCellInfo;
  accordionContentTpl: TemplateRef<any>;
  selectedRowsMap: Map<string, GridRowDataMeta>;
}

@Component({
  selector: 'mc-grid-body',
  styleUrls: ['grid-body.component.scss'],
  templateUrl: './grid-body.component.html'
})
export class GridBodyComponent extends BaseComponent {
  private selectedRowsOfGridBody: Array<any> = [];

  Theme = ComponentTheme;
  Icon = Icon;

  rowBordersWidth = 2;
  GridAction = GridAction;

  defaultState: State = {
    data: [],
    rowHeight: 30,
    columns: [],
    idField: 'id',
    startRowIndex: 0,
    tpls: {},
    hasAccordionRow: false,
    selectedCell: null,
    accordionContentTpl: null,
    selectedRowsMap: new Map<string, any>()
  };

  state: State;

  defaultConfig: GridBodyConfig = {
    rowHeight: 30,
    idField: 'id',
    tpls: {},
    selectCellByMouseOver: false,
    data: [],
    columns: [],
    startRowIndex: 0,
    selectableCell: false,
    selectedCell: null,
    // accordion
    hasAccordionRow: false,
    accordionContentTpl: null,
    accordionContentHeight: 300,
    selectedRows: null,
    multiSelectRow: false,
    pageIndex: null
  };

  _config: GridBodyConfig;

  @Input()
  set selectedCell(selectedCell: GridCellInfo) {
    this.setState({ selectedCell });
  }

  @Input()
  set selectedRows(selectedRows: Array<any>) {
    this.selectedRowsOfGridBody = [];
    const selectedRowsMap = selectedRows.reduce(
      (map, row) => map.set(this.getStringRowID(row), row),
      new Map<string, any>()
    );
    this.setState({ selectedRowsMap });
  }

  @HostListener('click', ['$event'])
  onPress(e: MouseEvent) {
    // TODO: when there is no theme, this is not working. it may need to be added a unique theme id.
    // When a grid contains a grid as a accordion content, it has same ".cell", we need to check this cell is in this grid or not.
    const theme = this._config.themes.length ? this._config.themes[0] : '';
    if (this._config.selectableCell) {
      const cellClass = theme ? '.' + theme + '-cell' : '.cell';
      const cellEl = findParentDom(e.target, cellClass);
      if (cellEl) {
        this.onSelectCell(e, cellEl);
      }
    }
    const rowClass = theme ? '.' + theme + '-row' : '.row';
    const rowEl = findParentDom(e.target, rowClass);
    if (rowEl) {
      this.onSelectRow(e, rowEl.children[0] as HTMLElement); // .cells
    }
  }

  constructor(protected er: ElementRef, private cd: ChangeDetectorRef) {
    super(er);
  }

  afterInitCmp() {
    this.bindEvents();
  }

  bindEvents() {
    // separate mouseover event for the performance of change detection
    if (this._config.selectCellByMouseOver) {
      this.el.addEventListener('mouseover', this.onMouseover.bind(this));
    }
  }

  applyState(config: GridBodyConfig) {
    this.selectedRows = config.selectedRows;
    // TODO: state is not updated....
    this.cd.detectChanges();
  }

  getAccordionContentHeight(row: any) {
    const meta: GridRowMeta = row && row.__meta__ ? row.__meta__ : {};
    return meta.accordionContentHeight || this._config.accordionContentHeight;
  }

  getStringRowID(row: any) {
    return '' + row[this._config.idField];
  }

  getGridRowClassName(rowIndex: number, row: any) {
    const config = this._config;
    const startRowIndex = config.startRowIndex;
    const rowMeta: GridRowMeta = row.__meta__;
    const cls = ['row'];
    if (rowIndex + startRowIndex === 0) {
      cls.push('is-first-row');
    }
    cls.push((rowIndex + startRowIndex) % 2 ? 'row-odd' : 'row-even');
    if (rowMeta && rowMeta.class) {
      cls.push(rowMeta.class);
    }
    if (this.isSelectedRow(this.getStringRowID(row))) {
      this.selectedRowsOfGridBody.push(row);
      cls.push('selected');
    }
    if (config.themes && config.themes.length) {
      cls.push(...config.themes.map(t => t + '-row'));
    }
    return cls.join(' ');
  }

  getGridCellClassName(rowIndex: number, colIndex: number, column: Column) {
    const cls = ['cell'];
    const config = this._config;
    const selectedCell = config.selectedCell;
    const startRowIndex = config.startRowIndex;
    if (column.align) {
      cls.push('align-' + column.align.toLowerCase());
    }
    if (!column.noOverflowMask) {
      cls.push('overflow-mask');
    }
    if (column.selectable === false) {
      cls.push('unselectable');
    }
    if (
      column.selectable &&
      selectedCell &&
      selectedCell.row === rowIndex + startRowIndex &&
      selectedCell.col === colIndex
    ) {
      cls.push('selected');
    }
    if (column.class) {
      cls.push(column.class);
    }
    if (config.themes && config.themes.length) {
      cls.push(...config.themes.map(t => t + '-cell'));
    }
    return cls.join(' ');
  }

  getTplContext(row: any, column: Column, rowIndex: number, colIndex: number) {
    const config = this._config;
    const fieldMeta: GridFieldMeta =
      row.__meta__ && row.__meta__.fieldMeta ? row.__meta__.fieldMeta[column.field] : null;
    return {
      $implicit: row,
      column: column,
      rowIndex: rowIndex + config.startRowIndex,
      cellData: row[column.field],
      cellMetaData: fieldMeta,
      colIndex,
      rowCount: config.data.length,
      colCount: config.columns.length
    };
  }

  getTitle(field, row) {
    const fieldMeta: GridFieldMeta = row.__meta__ && row.__meta__.fieldMeta ? row.__meta__.fieldMeta[field] : {};
    const title = fieldMeta.title || row[field];
    return typeof title === 'string' ? title : '';
  }

  isSelectedRow(id: any) {
    return this.state.selectedRowsMap && this.state.selectedRowsMap.has('' + id);
  }

  getSelectedRowsOfGridBody() {
    return this.selectedRowsOfGridBody;
  }

  onSelectRow(event: MouseEvent, el: HTMLElement) {
    const dataset = el.dataset;
    switch (dataset.action) {
      case GridAction.SELECT_ROW:
        const selectedRowsMap = this.state.selectedRowsMap;
        const id = dataset.id;
        const rowIndex = +dataset.row_index;
        const rowDataIndex = +dataset.row_data_index;
        const rowData = this.state.data[rowDataIndex];
        let action = GridAction.SELECT_ROW;
        let accordionContentEl: HTMLElement;
        if (this.state.hasAccordionRow) {
          accordionContentEl = findParentDom(el, '.row').querySelector('.row--content--container');
        }
        if (selectedRowsMap.has(id)) {
          action = GridAction.UNSELECT_ROW;
        }
        this.action.emit({
          target: this,
          event,
          rowEl: el,
          action,
          id,
          rowIndex,
          rowData,
          accordionContentEl,
          pageIndex: this._config.pageIndex
        });
        break;
    }
  }

  onSelectCell(event: MouseEvent, el: HTMLElement, action: GridAction = null) {
    const dataset = el.dataset;
    action = action || (dataset.action as GridAction);
    const config = this._config;
    switch (dataset.action) {
      case GridAction.SELECT_CELL:
        const rowIndex = +dataset.row_index;
        const cellIndex = +dataset.cell_index;
        const field = dataset.field;
        const rowData = config.data[rowIndex - config.startRowIndex];
        const cellData = rowData ? rowData[field] : null;
        let selectedCell: GridCellInfo = null;
        if (action !== GridAction.MOUSEOVER_CELL) {
          selectedCell = {
            row: rowIndex,
            col: cellIndex,
            data: cellData
          };
        }
        const actionEvent: GridBodyActionEvent = {
          event,
          cellEl: el,
          action,
          target: this,
          id: dataset.id,
          rowIndex,
          cellIndex,
          field,
          rowData,
          cellData,
          selectedCell,
          pageIndex: this._config.pageIndex
        };
        this.action.emit(actionEvent);
        break;
    }
  }

  onMouseover(e: MouseEvent) {
    const el = findParentDom(e.target, '.cell');
    if (el) {
      this.onSelectCell(e, el, GridAction.MOUSEOVER_CELL);
    }
  }
}
