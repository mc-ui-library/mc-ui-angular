import {
  VizData,
  Box,
  VizScaleType,
  Location,
  VizSize,
  Column
} from '../shared.models';
import * as d3 from 'd3';

export function getMinMax(data: VizData[]) {
  return data.reduce(
    (res, d) => {
      d.values.forEach(item => {
        res.min = Math.min(res.min, item.value);
        res.max = Math.max(res.max, item.value);
      });
      return res;
    },
    {
      min: Infinity,
      max: -Infinity
    }
  );
}

export function renderChartContainer(
  el: HTMLElement,
  vizSize: VizSize,
  themeClass: string[] = []
) {
  // apply margin
  const svg = d3
    .select(el)
    .append('svg')
    .attr('class', themeClass.join(' '))
    .attr('width', vizSize.width)
    .attr('height', vizSize.height);
  return svg
    .append('g')
    .attr(
      'transform',
      `translate(${vizSize.margin.left},${vizSize.margin.top})`
    );
}

export function getScale(
  type: VizScaleType,
  domain: any[],
  range: any,
  padding: number = null,
  paddingInner: number = null,
  paddingOuter: number = null
) {
  let scale: any;
  switch (type) {
    case VizScaleType.BAND:
      scale = d3.scaleBand();
      break;
    case VizScaleType.LINEAR:
      scale = d3.scaleLinear();
      break;
  }
  scale = scale.domain(domain).rangeRound(range);
  if (padding) {
    scale = scale.padding(padding);
  }
  if (paddingInner) {
    scale = scale.paddingInner(paddingInner);
  }
  if (paddingOuter) {
    scale = scale.paddingOuter(paddingOuter);
  }
  return scale;
}

export function getAxis(
  location: Location,
  scale,
  ticks = null,
  tickFormat = null
) {
  let axis;
  switch (location) {
    case Location.LEFT:
      axis = d3.axisLeft(scale);
      break;
    case Location.BOTTOM:
      axis = d3.axisBottom(scale);
      break;
    case Location.RIGHT:
      axis = d3.axisRight(scale);
      break;
  }
  if (ticks) {
    axis = axis.ticks(ticks);
  }
  if (tickFormat) {
    axis = axis.tickFormat(tickFormat);
  }
  return axis;
}

export function renderAxis(
  svg: any,
  location: Location,
  axis,
  vizSize: Box,
  themeClass: string[] = []
) {
  svg = svg.append('g').attr('class', themeClass.join(' '));
  switch (location) {
    case Location.BOTTOM:
      svg = svg.attr('transform', `translate(0,${vizSize.height})`);
      break;
    case Location.RIGHT:
      svg = svg.attr('transform', `translate(${vizSize.width},0)`);
      break;
  }
  svg.call(axis);
}

export function getSVGSize(el: HTMLElement, selector: string) {
  const svg: SVGSVGElement = el.querySelector(selector);
  return svg.getBBox();
}

export function renderGrid(
  svg: any,
  direction: 'x' | 'y',
  axis,
  vizSize: Box,
  themeClass: string[] = []
) {
  svg = svg.append('g').attr('class', themeClass.join(' '));
  let tickSize;
  switch (direction) {
    case 'x':
      svg = svg.attr('transform', `translate(0,${vizSize.height})`);
      tickSize = -vizSize.height;
      break;
    case 'y':
      tickSize = -vizSize.width;
      break;
  }
  svg.call(axis.tickSize(tickSize).tickFormat(''));
}

export function getAxisSize(
  el: HTMLElement,
  svg: any,
  location: Location,
  axis,
  vizSize: Box,
  themeClass: string[] = []
) {
  renderAxis(svg, location, axis, vizSize, themeClass);
  return getSVGSize(el, '.' + themeClass[0]);
}

export function convertVizToGridData(
  data: Array<VizData>,
  seriesColumnName = ''
) {
  const items = [];
  const columns: Array<Column> = [];
  const isEmpty = this.util.isEmpty;
  if (seriesColumnName) {
    columns.push({
      name: seriesColumnName,
      field: 'series'
    });
  }
  data.forEach(dataItem => {
    columns.push({
      name: dataItem.label,
      field: dataItem.label
    });
    dataItem.values.forEach((val, j) => {
      // rows
      if (!items[j]) {
        items[j] = {
          series: val.series
        };
      }
      items[j][dataItem.label] = isEmpty(val.value) ? '' : val.value;
    });
  });
  return normalizeVizGridData(items, columns);
}

export function normalizeVizGridData(
  items: any[],
  columns: any[],
  idField: string = 'id',
  tplCellFunc: any = null
) {
  const rows: any[] = [];
  const isEmpty = this.util.isEmpty;
  let row: any = {};
  let rowIdx = 0;
  // add column names
  row = {
    id: rowIdx,
    dataId: 'column_header_row'
  };
  rowIdx = 0;
  row.cells = columns.map((col, i) => {
    return {
      id: `${i}|${rowIdx}`,
      idx: i,
      value: col.displayName,
      icon: col.icon || '',
      cls: 'cell__header cell__column-header',
      extraCls: col.extraCls ? col.extraCls : '',
      hide: col.hide,
      dataType: col.dataType || 'string',
      fieldName: col.fieldName,
      render: col.render,
      editor: col.editor,
      width: col.width,
      align: col.align
    };
  });
  rows.push(row);
  // add items
  rowIdx++;
  items.forEach((item, i) => {
    row = {
      id: rowIdx,
      dataId: item[idField],
      item
    };
    row.cells = columns.map((col, j) => {
      if (tplCellFunc) {
        return tplCellFunc(rowIdx, j, col, item);
      } else {
        const val = item[col.fieldName];
        return {
          id: `${j}|${rowIdx}`,
          idx: j,
          value: isEmpty(val) ? '' : val,
          cls: 'cell__data',
          fieldName: col.fieldName
        };
      }
    });
    rows.push(row);
    rowIdx++;
  });
  return rows;
}

// function renderRect(data, svg, scaleX, scaleY, color, height, hasNegativeValue = false, minX = 0, scaleX1: any = {}, scaleY1: any = {}, colorBySize = false, vertical = true, stacked = false, halfShift = false, maxBarWidth = 100) {
//   const duration = 500;
//   const groupScale = scaleX;
//   const bandwidth = scaleX.bandwidth();
//   const bandwidth1 = scaleX1.bandwidth();
//   let barWidth = bandwidth;
//   let barWidth1 = bandwidth1;
//   let offsetX = 0;
//   let offsetX1 = 0;
//   if (barWidth > maxBarWidth) {
//     barWidth = maxBarWidth;
//     offsetX = (bandwidth - maxBarWidth) / 2;
//   }
//   if (barWidth1 > maxBarWidth) {
//     barWidth1 = maxBarWidth;
//     offsetX1 = (bandwidth1 - maxBarWidth) / 2;
//   }
//   let rects = svg.append('g').selectAll('g')
//     .data(data)
//     .enter().append('g')
//     .attr('data-groupid', (d, i) => i)
//     .attr('class', 'mc-chart--group-item')
//     .attr('transform', d => {
//       let gs = groupScale(d.label);
//       gs = isNaN(gs) ? 0 : gs;
//       if (halfShift) {
//         gs += bandwidth / 2;
//       }
//       return vertical ? `translate(${gs},0)` : `translate(0, ${gs})`;
//     });

//   rects = rects
//     .selectAll('rect')
//     .data(d => d.values);
//   // for updating data
//   rects.exit()
//     .transition().duration(duration)
//     .remove();

//   rects = rects
//     .enter().append('rect');

//   if (vertical) {
//     rects
//       .attr('data-series', d => d.series)
//       .attr('class', 'mc-chart--item')
//       .attr('width', d => {
//         let w = stacked ? scaleX.bandwidth() : scaleX1.bandwidth();
//         w = w < 1 ? 1 : w;
//         return w;
//       })
//       .attr('x', (d, i) => {
//         let x = stacked ? scaleX(d.series) + offsetX : scaleX1(d.series) + offsetX1;
//         x = isNaN(x) ? 0 : x;
//         return x;
//       })
//       .attr('fill', d => d.color ? d.color : color(colorBySize ? d.value : d.series))
//       .attr('title', d => d.title || `${d.series}: ${d.value}`)
//       .attr('y', !hasNegativeValue ? height : scaleY(0))
//       .attr('height', 0)
//       .transition()
//       .duration(duration)
//       .ease(d3.easeSinOut)
//       .attr('y', (d, i) => {
//         let y;
//         if (stacked) {
//           y = scaleY(d.value1);
//         } else {
//           y = +d.value > 0 ? scaleY(d.value) : scaleY(0);
//         }
//         return y;
//       })
//       .attr('height', d => {
//         let h = stacked ? height - scaleY(d.value1 - d.value0) : hasNegativeValue ? Math.abs(scaleY(d.value) - scaleY(0)) : height - scaleY(d.value);
//         h = h < 1 ? 1 : h;
//         return h;
//       });
//   } else {
//     rects
//       .attr('data-series', d => d.series)
//       .attr('class', 'mc-chart--item')
//       .attr('height', d => {
//         let h = stacked ? scaleY.bandwidth() : scaleY1.bandwidth();
//         h = h < 1 ? 1 : h;
//         return h;
//       })
//       .attr('y', (d, i) => {
//         let y = stacked ? scaleY(d.series) : scaleY1(d.series);
//         y = isNaN(y) ? 0 : y;
//         return y;
//       })
//       .attr('fill', d => d.color ? d.color : color(colorBySize ? d.value : d.series))
//       .attr('title', d => d.title || `${d.series}: ${d.value}`)
//       .attr('x', !hasNegativeValue ? 0 : scaleX(0))
//       .attr('width', 0)
//       .transition()
//       .duration(duration)
//       .ease(d3.easeSinOut)
//       .attr('x', d => {
//         let x;
//         if (stacked) {
//           x = scaleX(d.value1);
//         } else {
//           x = +d.value > 0 ? hasNegativeValue ? scaleX(0) : scaleX(minX) : scaleX(d.value);
//         }
//         return x;
//       })
//       .attr('width', d => {
//         let w = stacked ? scaleX(d.value1 - d.value0) : hasNegativeValue ? Math.abs(scaleX(d.value) - scaleX(0)) : scaleX(d.value);
//         w = w < 1 ? 1 : w;
//         return w;
//       });
//   }
// }
