import { GridRowMeta } from '../mc-ui.models';
import { Column } from '../mc-ui.models';

export function getAutoColumnWidth(
  columns: Column[],
  containerWidth: number,
  columnWidthIsRatio = false,
  minWidth = 0
) {
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
      const adjustContainerWidth = containerWidth - totalFixedWidth;
      let adjustTotalWidth = 0;
      columns = columns.map(column => {
        // Use Math.floor since the cell width has x.xx, the web browser doesn't display correctly. so, we need integer. If there is a gap, we need to spread it to the columns.
        column.width = column.fixedWidth
          ? column.width
          : Math.floor((column.width / totalWidth) * adjustContainerWidth);
        adjustTotalWidth += column.width;
        return column;
      });
      // if it remains the width, spread it
      let remainWidth = adjustContainerWidth - adjustTotalWidth;
      while (remainWidth > 0) {
        columns.forEach(column => {
          if (remainWidth > 0) {
            column.width++;
            remainWidth--;
          }
        });
      }
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
  });
}
