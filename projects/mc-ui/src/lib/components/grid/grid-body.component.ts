import { GridRowMeta, GridFieldMeta } from '../../mc-ui.models';
import { GridAction, GridCellInfo, Column, GridBodyConfig, GridBodyActionEvent } from '../../mc-ui.models';
import { BaseComponent } from '../base.component';
import { Component, ElementRef, HostListener, HostBinding, TemplateRef } from '@angular/core';
import { findParentDom } from '../../utils/utils';

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
  selectedRowsMap: Map<string, any>;
}

@Component({
  selector: 'mc-grid-body',
  styleUrls: ['grid-body.component.scss'],
  templateUrl: './grid-body.component.html'
})
export class GridBodyComponent extends BaseComponent {
  GridAction = GridAction;

  state: State = {
    data: [],
    rowHeight: 30,
    columns: [],
    idField: 'id',
    startRowIndex: 0,
    tpls: {},
    hasAccordionRow: false,
    selectedCell: null,
    accordionContentTpl: null,
    selectedRowsMap: null
  };

  _config: GridBodyConfig = {
    rowHeight: 30,
    idField: 'id',
    tpls: {},
    selectCellByMouseOver: false,
    data: [],
    columns: [],
    startRowIndex: 0,
    isLoading: false,
    selectedCell: null,
    // accordion
    hasAccordionRow: false,
    accordionContentTpl: null,
    accordionContentHeight: 300,
    selectedRowsMap: null,
    multiSelectRow: false,
    pageIndex: null
  };

  @HostBinding('class.is-loading') private isLoading = false;
  @HostBinding('class.has-accordion-row') private hasAccordionRow = false;

  @HostListener('click', ['$event'])
  onPress(e: MouseEvent) {
    const el = findParentDom(e.target, '.cell');
    if (el) {
      this.onSelectCell(e, el);
      this.onSelectRow(e, el.parentElement);
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseover(e: MouseEvent) {
    if (this._config.selectCellByMouseOver) {
      const el = findParentDom(e.target, '.cell');
      if (el) {
        this.onSelectCell(e, el, GridAction.MOUSEOVER_CELL);
      }
    }
  }

  constructor(protected er: ElementRef) {
    super(er);
  }

  applyConfig(config: GridBodyConfig) {
    this.isLoading = config.isLoading;
    this.hasAccordionRow = config.hasAccordionRow;
  }

  applyState(config: GridBodyConfig) {
    this.isLoading = false;
  }

  getGridRowClassName(rowIndex: number, row: any) {
    const config = this._config;
    const startRowIndex = config.startRowIndex;
    const selectedCell = this._config.selectedCell;
    const rowMeta: GridRowMeta = row.__meta__;
    const cls = ['row'];
    if (rowIndex + startRowIndex === 0) {
      cls.push('is-first-row');
    }
    cls.push((rowIndex + startRowIndex) % 2 ? 'row-odd' : 'row-even');
    if (rowMeta && rowMeta.class) {
      cls.push(rowMeta.class);
    }
    if (selectedCell && selectedCell.row === rowIndex + startRowIndex) {
      cls.push('selected');
    }
    cls.push(...config.themes.map(t => t + '-row'));
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
    cls.push(...config.themes.map(t => t + '-cell'));
    return cls.join(' ');
  }

  getTplContext(row: any, column: Column, rowIndex: number, colIndex: number) {
    const config = this._config;
    const fieldMeta: GridFieldMeta = row.__meta__ ? row.__meta__.fieldMeta[column.field] : null;
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
    const fieldMeta: GridFieldMeta = row.__meta__ ? row.__meta__.fieldMeta[field] : {};
    const title = fieldMeta.title || row[field];
    return typeof title === 'string' ? title : '';
  }

  getAccordionContentHeight(row: any) {
    const meta: GridRowMeta = row.__meta__ || {};
    return meta.accordionContentHeight || this._config.accordionContentHeight;
  }

  selectRow(id: string, rowData: any) {
    let selectedRowsMap = this.state.selectedRowsMap;
    if (!this._config.multiSelectRow) {
      selectedRowsMap = new Map<string, any>();
      selectedRowsMap.set(id, rowData);
    }
    selectedRowsMap.set(id, rowData);
    this.setState({ selectedRowsMap });
  }

  unselectRow(id: string) {
    const config = this._config;
    if (config.multiSelectRow) {
      const selectedRowsMap = this.state.selectedRowsMap;
      selectedRowsMap.delete(id);
      this.setState({ selectedRowsMap });
    }
  }

  isSelectedRow(id: string) {
    return this.state.selectedRowsMap.has(id);
  }

  onSelectRow(event: MouseEvent, el: HTMLElement) {
    const dataset = el.dataset;
    switch (dataset.action) {
      case GridAction.SELECT_ROW:
        const selectedRowsMap = this.state.selectedRowsMap;
        const id = dataset.id;
        const rowIndex = +dataset.rowIndex;
        const rowDataIndex = +dataset.rowDataIndex;
        const rowData = this.state.data[rowDataIndex];
        let action = GridAction.SELECT_ROW;
        let accordionContentEl: HTMLElement;
        let accordionContentHeight = 0;
        if (this.state.hasAccordionRow) {
          accordionContentEl = findParentDom(el, '.row').querySelector('.row--content--container');
          accordionContentHeight = this.getAccordionContentHeight(rowData);
        }
        if (selectedRowsMap.has(id)) {
          this.unselectRow(id);
          action = GridAction.UNSELECT_ROW;
        } else {
          this.selectRow(id, rowData);
        }
        const actionEvent: GridBodyActionEvent = {
          target: this,
          event,
          rowEl: el,
          action,
          id,
          rowIndex,
          rowData,
          selectedRowsMap,
          accordionContentEl,
          accordionContentHeight,
          pageIndex: this._config.pageIndex
        };
        this.action.emit(actionEvent);
        break;
    }
  }

  onSelectCell(event: MouseEvent, el: HTMLElement, action: GridAction = null) {
    const dataset = el.dataset;
    action = action || (dataset.action as GridAction);
    const config = this._config;
    switch (dataset.action) {
      case GridAction.SELECT_CELL:
        const rowIndex = +dataset.rowindex;
        const cellIndex = +dataset.cellindex;
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
        this.setState({ selectedCell });
        this.action.emit(actionEvent);
        break;
    }
  }
}
