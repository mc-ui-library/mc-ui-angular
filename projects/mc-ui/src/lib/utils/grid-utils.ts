import { Column } from './../models';

export function getAutoColumnWidth(columns: Column[], containerWidth: number, columnWidthIsRatio = false, minWidth = 0) {
  const hasColWidth = columns && columns[0].width;
  if (columnWidthIsRatio) {
    if (hasColWidth) {
      let totalFixedWidth = 0;
      const totalWidth = columns.reduce((tot: number, col: Column) => {
        if (col.fixedWidth) {
          totalFixedWidth += col.width;
        } else {
          tot = tot + col.width;
        }
        return tot;
      }, 0);
      this.lastContainerWidth = containerWidth;
      const adjustContainerWidth = containerWidth - totalFixedWidth;
      // update state
      columns = columns.map(column => {
        column.width = column.fixedWidth ? column.width : (column.width / totalWidth) * adjustContainerWidth;
        return column;
      });
    } else {
      columns = getEvenColumnWidth(columns, containerWidth, minWidth);
    }
  } else {
    columns = getEvenColumnWidth(columns, containerWidth, minWidth);
  }
  return columns;
}

export function getEvenColumnWidth(columns: Column[], containerWidth: number, minWidth = 0) {
  // auto column width
  let colWidth = containerWidth / columns.length;
  colWidth = colWidth < minWidth ? minWidth : colWidth;
  // update state
  return columns.map(column => {
    column.width = colWidth;
    return column;
  })
}
