import {
  ChartData,
  Box,
  ChartScaleType,
  Location,
  ChartSize
} from './../models';
import * as d3 from 'd3';

export function getMinMax(data: ChartData[]) {
  return data.reduce((res, d) => {
    d.values.forEach(item => {
      res.min = Math.min(res.min, item.value);
      res.max = Math.max(res.max, item.value);
    });
    return res;
  }, {
    min: Infinity,
    max: -Infinity
  });
}

export function renderChartContainer(el: HTMLElement, chartSize: ChartSize, themeClass: string[] = []) {
  // apply margin
  const svg = d3.select(el).append('svg').attr('class', themeClass.join(' ')).attr('width', chartSize.width).attr('height', chartSize.height);
  return svg.append('g').attr('transform', `translate(${chartSize.margin.left},${chartSize.margin.top})`);
}

export function getScale(type: ChartScaleType, domain: any[], range: any, padding: number = null, paddingInner: number = null, paddingOuter: number = null) {
  let scale: any;
  switch (type) {
    case ChartScaleType.BAND:
      scale = d3.scaleBand();
      break;
    case ChartScaleType.LINEAR:
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

export function getAxis(location: Location, scale, ticks = null, tickFormat = null) {
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

export function renderAxis(svg: any, location: Location, axis, chartSize: Box, themeClass: string[] = []) {
  svg = svg.append('g').attr('class', themeClass.join(' '));
  switch (location) {
    case Location.BOTTOM:
      svg = svg.attr('transform', `translate(0,${chartSize.height})`);
      break;
    case Location.RIGHT:
      svg = svg.attr('transform', `translate(${chartSize.width},0)`);
      break;
  }
  svg.call(axis);
}

export function getSVGSize(el: HTMLElement, selector: string) {
  const svg: SVGSVGElement = el.querySelector(selector);
  return svg.getBBox();
}

export function renderGrid(svg: any, direction: 'x' | 'y', axis, chartSize: Box, themeClass: string[] = []) {
  svg = svg.append('g').attr('class', themeClass.join(' '));
  let tickSize;
  switch (direction) {
    case 'x':
      svg = svg.attr('transform', `translate(0,${chartSize.height})`);
      tickSize = -chartSize.height;
      break;
    case 'y':
      tickSize = -chartSize.width;
      break;
  }
  svg.call(axis.tickSize(tickSize).tickFormat(''));
}

export function getAxisSize(el: HTMLElement, svg: any, location: Location, axis, chartSize: Box, themeClass: string[] = []) {
  renderAxis(svg, location, axis, chartSize, themeClass);
  return getSVGSize(el, '.' + themeClass[0]);
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
