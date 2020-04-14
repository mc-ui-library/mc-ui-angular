import {
  Box,
  Location,
  VisualizerSize,
  MinMax,
  VisualizerConfig,
  VisualizerRenderInfo,
  VisualizerChartSize
} from '../shared.models';
import * as d3 from 'd3';

export function getMinMax(
  fields: Array<string>,
  data: Array<any>,
  decorationMaxRate = 1
): MinMax {
  const mm = data.reduce(
    (minMax: MinMax, d) => {
      fields.forEach(field => {
        const val = +d[field];
        if (typeof val === 'number' && !isNaN(val)) {
          minMax.min = Math.min(minMax.min, val);
          minMax.max = Math.max(minMax.max, val);
        }
      });
      return minMax;
    },
    { min: Infinity, max: -Infinity }
  );
  mm.max = mm.max * decorationMaxRate;
  return mm;
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
  size: VisualizerChartSize,
  themeClass: string[] = []
) {
  svg = svg.append('g').attr('class', themeClass.join(' '));
  switch (location) {
    case Location.BOTTOM:
      svg = svg.attr('transform', `translate(0,${size.height})`).call(axis);
      if (size.rotateXAxisText) {
        svg
          .selectAll('.tick text')
          .attr(
            'style',
            'transform: rotate(-45deg) translate(-4px,-6px);text-anchor:end;'
          );
      }
      break;
    case Location.RIGHT:
      svg.attr('transform', `translate(${size.width},0)`).call(axis);
      break;
    case Location.LEFT:
      svg.call(axis);
      break;
  }
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
  visualizerSize: VisualizerSize,
  themeClass: string[] = []
) {
  renderAxis(svg, location, axis, visualizerSize, themeClass);
  const boxSize = getSVGSize(el, '.' + themeClass[0]);
  switch (location) {
    case Location.BOTTOM:
      visualizerSize = applyXAxisTextSize(el, visualizerSize, themeClass[0]);
      break;
    case Location.LEFT:
      visualizerSize.margin.left = boxSize.width;
      break;
    case Location.RIGHT:
      visualizerSize.margin.right = boxSize.width;
  }
  return visualizerSize;
}

export function initVisualizerSize(el: HTMLElement): VisualizerSize {
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  return {
    width,
    height,
    chart: {
      width,
      height,
      rotateXAxisText: false // when overlapping the x axis text
    },
    margin: {
      top: 0, // for showing the first y axis label
      left: 0,
      right: 0,
      bottom: 0
    }
  };
}

export function applyXAxisTextSize(el: any, size: VisualizerSize, cls: string) {
  const els = el.querySelectorAll(`.${cls} .tick`);
  const tickWidth =
    els.length > 1 ? getTranslateX(els[1]) - getTranslateX(els[0]) : -1;
  let lastTextSize;
  const maxWidth: any = Array.from(els).reduce((max: number, _el: any) => {
    lastTextSize = _el.getBBox();
    return Math.max(lastTextSize.width, max);
  }, -Infinity);
  let textHeight = lastTextSize.height;
  if (tickWidth < maxWidth) {
    size.chart.rotateXAxisText = true;
    textHeight = maxWidth;
  }
  size.margin.top = lastTextSize.height / 2;
  size.margin.right = maxWidth / 2;
  size.margin.bottom = size.chart.rotateXAxisText
    ? textHeight + 5
    : lastTextSize.height;
  return size;
}

export function getTranslateX(el) {
  const t = el.getAttribute('transform');
  const val = t.split('translate(')[1].split(',')[0];
  return +val;
}

export function renderRects(
  config: VisualizerConfig,
  renderInfo: VisualizerRenderInfo
) {
  const { svg, unit, size } = renderInfo;
  const data = config.data.data;
  const animDuration = 1000;

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

  rects = rects
    .selectAll('rect')
    .data((d, i) =>
      unit.fields.map(field => ({ field, value: +data[i][field] }))
    );

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
    .ease(d3.easeQuadIn)
    .attr('y', d => (d.value > 0 ? unit.yScale(d.value) : unit.yScale(0)))
    .attr('height', d => {
      const h =
        unit.minMax.min < 0
          ? Math.abs(unit.yScale(d.value) - unit.yScale(0))
          : size.chart.height - unit.yScale(d.value);
      return h < 0 ? 0 : h;
    });
}

export function renderLines(
  config: VisualizerConfig,
  renderInfo: VisualizerRenderInfo
) {
  const { svg, unit, size } = renderInfo;
  const data = config.data.data;
  const animDuration = 1000;

  const fieldLabelValueMap = unit.labels.reduce((map, label, rowIndex) => {
    unit.fields.forEach(field => {
      const labelValues = map.get(field) || [];
      labelValues.push({ field, label, value: data[rowIndex][field] });
      map.set(field, labelValues);
    });
    return map;
  }, new Map<string, Array<any>>());

  const lineData = [...fieldLabelValueMap.values()];

  unit.line = d3
    .line()
    .x((d: any) => unit.xScale(d.label))
    .y((d: any) => unit.yScale(d.value));

  const line = svg
    .selectAll('.lines')
    .data(lineData)
    .enter()
    .append('g')
    .attr('class', 'lines')
    .attr('transform', d => `translate(${unit.xScale.bandwidth() / 2},0)`);

  const path = line
    .append('path')
    .attr('class', 'line')
    .attr('d', d => unit.line(d))
    .style('stroke', d => unit.colorScale(d[0].field))
    .style('stroke-width', 1.5)
    .style('stroke-linejoin', 'round')
    .style('stroke-linecap', 'round')
    .style('fill', 'none')
    .attr('stroke-dasharray', function() {
      const totalLength = this.getTotalLength();
      return totalLength + ' ' + totalLength;
    })
    .attr('stroke-dashoffset', function() {
      const totalLength = this.getTotalLength();
      return totalLength;
    })
    .transition()
    .duration(animDuration)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);

  const circle = svg
    .selectAll('.circles')
    .data(lineData)
    .enter()
    .append('g')
    .attr('class', 'circles')
    .attr('transform', d => `translate(${unit.xScale.bandwidth() / 2},0)`);

  const circles = circle
    .selectAll('circle')
    .data(d => d)
    .enter()
    .append('circle');
  circles
    .attr('class', 'circle')
    .attr('cx', d => unit.xScale(d.label))
    .attr('cy', d => unit.yScale(d.value))
    .attr('r', '2')
    .attr('onmouseover', 'this.setAttribute("r", 4)')
    .attr('onmouseout', 'this.setAttribute("r", 2)')
    .style('stroke', d => unit.colorScale(d.field))
    .style('fill', '#fff');
}
