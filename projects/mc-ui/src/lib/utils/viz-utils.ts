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

export function renderRects(
  config: VisualizerConfig,
  renderInfo: VisualizerRenderInfo
) {
  const { svg, unit, size } = renderInfo;
  const data = config.data.data;
  const animDuration = 300;
  let rects = svg
    .append('g')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'group rects')
    .attr('transform', d => `translate(${unit.xScale(d.label)},0)`);

  rects = rects.selectAll('rect').data(d => config.dataFields);

  // for updating data
  rects
    .exit()
    .transition()
    .duration(animDuration)
    .remove();

  rects = rects.enter().append('rect');

  rects
    .attr('class', 'item rect')
    .attr('width', fields => unit.xScale.bandwidth())
    .attr('x', (d, i) => )
    .attr('fill', d =>
      d.color ? d.color : unit.color(this.colorBySize ? d.value : d.series)
    )
    .attr('title', d => d.title || `${d.series}: ${d.value}`)
    .attr(
      'y',
      !this.hasNegativeValue ? size.height - size.margin.bottom : unit.scaleY(0)
    )
    .attr('height', 0)
    .transition()
    .duration(duration)
    .ease(this.d3.easeSinOut)
    .attr('y', (d, i) => {
      let y;
      if (this.barType === 'stacked') {
        y = unit.scaleY(d.value1);
      } else {
        y = +d.value > 0 ? unit.scaleY(d.value) : unit.scaleY(0);
      }
      return y;
    })
    .attr('height', d => {
      let h =
        this.barType === 'stacked'
          ? size.cHeight - unit.scaleY(d.value1 - d.value0)
          : this.hasNegativeValue
          ? Math.abs(unit.scaleY(d.value) - unit.scaleY(0))
          : size.cHeight - unit.scaleY(d.value);
      h = h < 1 ? 1 : h;
      return h;
    });
}
