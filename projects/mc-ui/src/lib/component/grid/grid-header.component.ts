import {
  MCUIService
} from '../../mc-ui.service';
import {
  BaseComponent
} from '../base.component';
import {
  Component,
  ElementRef,
  Input
} from '@angular/core';

@Component({
  selector: 'mc-grid-header',
  styleUrls: ['grid-header.component.scss'],
  templateUrl: './grid-header.component.html'
})

export class GridHeaderComponent extends BaseComponent {

  @Input() columns: any[];
  /**
   * For headers,
   * [
   *  [ { name: 'xxx', colspan: 2, rowspan: 1 }, ... ],
   *  [ { name: 'xxx', colspan: 1, rowspan: 1 }, ... ]
   * ]
   */
  @Input() data: any[];
  @Input() rowHeight = 30;
  @Input() tpls = {};

  constructor(protected _el: ElementRef, protected _service: MCUIService) {
    super(_el, _service);
  }

  initCmp() {
    if (!this.data) {
      // generate header data
      this.data = [this.columns.map(column => {
        return { id: column.field, name: column.name || column.field, width: column.width };
      })];
    } else {
      const rows = [];
      // calc col width
      const lastIndex = this.data.length - 1;
      this.data.forEach((row, r) => {
        rows[r] = rows[r] || [];
        let c = 0;
        row.forEach(cell => {
          while (row[r][c] === -1) {
            c++;
          }
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
          c += colspan;
        });
      });
    }
  }
}
