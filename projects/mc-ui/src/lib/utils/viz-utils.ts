import {
  Box,
  Location,
  VisualizerSize,
  MinMax,
  VisualizerMetaField,
  VisualizerConfig,
  VisualizerRenderInfo
} from '../shared.models';
import * as d3 from 'd3';

export function getMinMaxMapByField(
  fields: Array<string>,
  data: Array<any>
): Map<string, MinMax> {
  return data.reduce((map, d) => {
    fields.forEach(field => {
      const val = +d[field];
      if (typeof val === 'number') {
        const totalMinMax = map.get(VisualizerMetaField.total) || {
          min: -Infinity,
          max: Infinity
        };
        const minMax = map.get(field) || {
          min: -Infinity,
          max: Infinity
        };
        minMax.min = Math.min(minMax.min, val);
        minMax.max = Math.max(minMax.max, val);
        totalMinMax.min = Math.min(totalMinMax.min, val);
        totalMinMax.max = Math.max(totalMinMax.max, val);
        map.set(field, minMax);
        map.set(VisualizerMetaField.total, totalMinMax);
      }
    });
    return map;
  }, new Map<string, MinMax>());
}

export function renderChartContainer(
  el: HTMLElement,
  visualizerSize: VisualizerSize
) {
  // apply margin
  const svg = d3
    .select(el)
    .append('svg')
    .attr('class', 'container')
    .attr('width', visualizerSize.width)
    .attr('height', visualizerSize.height);
  return svg
    .append('g')
    .attr(
      'transform',
      `translate(${visualizerSize.margin.left},${visualizerSize.margin.top})`
    );
}

export function renderAxis(
  svg: any,
  location: Location,
  axis,
  visualizerSize: Box,
  themeClass: string[] = []
) {
  svg = svg.append('g').attr('class', themeClass.join(' '));
  switch (location) {
    case Location.BOTTOM:
      svg = svg.attr('transform', `translate(0,${visualizerSize.height})`);
      break;
    case Location.RIGHT:
      svg = svg.attr('transform', `translate(${visualizerSize.width},0)`);
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
  axis: any,
  visualizerSize: Box,
  themeClass: string[] = []
) {
  svg = svg.append('g').attr('class', themeClass.join(' '));
  let tickSize;
  switch (direction) {
    case 'x':
      svg = svg.attr('transform', `translate(0,${visualizerSize.height})`);
      tickSize = -visualizerSize.height;
      break;
    case 'y':
      tickSize = -visualizerSize.width;
      break;
  }
  svg.call(axis.tickSize(tickSize).tickFormat(''));
}

export function getAxisSize(
  el: HTMLElement,
  svg: any,
  location: Location,
  axis: any,
  visualizerSize: Box,
  themeClass: string[] = []
) {
  renderAxis(svg, location, axis, visualizerSize, themeClass);
  return getSVGSize(el, '.' + themeClass[0]);
}

export function initVisualizerSize(el: HTMLElement): VisualizerSize {
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  return {
    width,
    height,
    chart: {
      width,
      height
    },
    margin: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  };
}

export function renderRects(
  config: VisualizerConfig,
  renderInfo: VisualizerRenderInfo
) {
  const { svg, unit, size } = renderInfo;
  const data = config.data.data;
  const animDuration = 300;

  unit.xScaleInner = d3
    .scaleBand()
    .domain(unit.fields)
    .rangeRound([0, unit.xScale.bandwidth()])
    .padding(0);

  let rects = svg
    .append('g')
    .selectAll('g')
    .data(unit.labels)
    .enter()
    .append('g')
    .attr('class', 'group rects')
    .attr('transform', (label: string) => `translate(${unit.xScale(label)},0)`);

  rects = rects.selectAll('rect').data((d, i) => {
    unit.fields.map(field => ({ field, value: data[i][field] }));
  });

  // for updating data
  rects
    .exit()
    .transition()
    .duration(animDuration)
    .remove();

  rects = rects.enter().append('rect');

  rects
    .attr('class', 'item rect')
    .attr('width', d => unit.xScaleInner.bandwidth(d.field))
    .attr('x', d => unit.xScaleInner(d.field))
    .attr('fill', d => unit.colorScale(d.field))
    .attr('title', d => `${d.field}: ${d.value}`)
    .attr(
      'y',
      unit.minMax.min < 0 ? size.height - size.margin.bottom : unit.yScale(0)
    )
    .attr('height', 0)
    .transition()
    .duration(animDuration)
    .ease(d3.easeSinOut)
    .attr('y', d => (d.value > 0 ? unit.yScale(d.value) : unit.yScale(0)))
    .attr('height', d =>
      unit.minMax2.min < 0
        ? Math.abs(unit.yScale(d.value) - unit.yScale(0))
        : size.chart.height - unit.yScale(d.value)
    );
}
