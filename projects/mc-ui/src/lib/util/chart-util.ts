import { Box } from './../component/model';
import * as d3 from 'd3';

export class ChartUtil {
  // ********************** Chart Utils *************************

  renderContainer(el: HTMLElement, themeClass: string[] = []) {
    return d3.select(el).append('svg').attr('class', themeClass.join(' ')).attr('width', el.offsetWidth).attr('height', el.offsetHeight);
  }

  getScale(type: 'band' | 'linear' | 'quantile', domain: any[], range: any, paddingInner: number = null, paddingOuter: number = null, padding: number = null) {
    let scale: any;
    switch (type) {
      case 'band':
        scale = d3.scaleBand();
        break;
      case 'linear':
        scale = d3.scaleLinear();
        break;
    }
    scale = scale.domain(domain).rangeRound(range);
    if (padding !== null) {
      scale = scale.padding(padding);
    }
    if (paddingInner !== null) {
      scale = scale.paddingInner(paddingInner);
    }
    if (paddingOuter !== null) {
      scale = scale.paddingOuter(paddingOuter);
    }
    return scale;
  }

  getAxis(location: 'left' | 'bottom' | 'right', scale, ticks = null, tickFormat = null) {
    let axis;
    switch (location) {
      case 'left':
        axis = d3.axisLeft(scale);
        break;
      case 'bottom':
        axis = d3.axisBottom(scale);
        break;
      case 'right':
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

  renderAxis(svg: any, location: 'left' | 'bottom' | 'right', axis, box: Box, themeClass: string[] = []) {
    svg = svg.append('g').attr('class', themeClass.join(' '));
    switch (location) {
      case 'left':
        svg = svg.attr('transform', `translate(0,${box.height})`);
        break;
      case 'right':
        svg = svg.attr('transform', `translate(${box.width},0)`);
        break;
    }
    svg.call(axis);
  }

  renderGrid(svg: any, location: 'x' | 'y', axis, box: Box, themeClass: string[] = []) {
    svg = svg.append('g').attr('class', themeClass.join(' '));
    let tickSize;
    switch (location) {
      case 'x':
        svg = svg.attr('transform', `translate(0,${box.height})`);
        tickSize = -box.height;
        break;
      case 'y':
        tickSize = -box.width;
        break;
    }
    svg.call(axis.tickSize(tickSize).tickFormat(''));
  }

  renderRect(data, svg, scaleX, scaleY, color, height, hasNegativeValue = false, minX = 0, scaleX1: any = {}, scaleY1: any = {}, colorBySize = false, vertical = true, stacked = false, halfShift = false, maxBarWidth = 100) {
    const duration = 500;
    const groupScale = scaleX;
    const bandwidth = scaleX.bandwidth();
    const bandwidth1 = scaleX1.bandwidth();
    let barWidth = bandwidth;
    let barWidth1 = bandwidth1;
    let offsetX = 0;
    let offsetX1 = 0;
    if (barWidth > maxBarWidth) {
      barWidth = maxBarWidth;
      offsetX = (bandwidth - maxBarWidth) / 2;
    }
    if (barWidth1 > maxBarWidth) {
      barWidth1 = maxBarWidth;
      offsetX1 = (bandwidth1 - maxBarWidth) / 2;
    }
    let rects = svg.append('g').selectAll('g')
      .data(data)
      .enter().append('g')
      .attr('data-groupid', (d, i) => i)
      .attr('class', 'mc-chart--group-item')
      .attr('transform', d => {
        let gs = groupScale(d.label);
        gs = isNaN(gs) ? 0 : gs;
        if (halfShift) {
          gs += bandwidth / 2;
        }
        return vertical ? `translate(${gs},0)` : `translate(0, ${gs})`;
      });

    rects = rects
      .selectAll('rect')
      .data(d => d.values);
    // for updating data
    rects.exit()
      .transition().duration(duration)
      .remove();

    rects = rects
      .enter().append('rect');

    if (vertical) {
      rects
        .attr('data-series', d => d.series)
        .attr('class', 'mc-chart--item')
        .attr('width', d => {
          let w = stacked ? scaleX.bandwidth() : scaleX1.bandwidth();
          w = w < 1 ? 1 : w;
          return w;
        })
        .attr('x', (d, i) => {
          let x = stacked ? scaleX(d.series) + offsetX : scaleX1(d.series) + offsetX1;
          x = isNaN(x) ? 0 : x;
          return x;
        })
        .attr('fill', d => d.color ? d.color : color(colorBySize ? d.value : d.series))
        .attr('title', d => d.title || `${d.series}: ${d.value}`)
        .attr('y', !hasNegativeValue ? height : scaleY(0))
        .attr('height', 0)
        .transition()
        .duration(duration)
        .ease(d3.easeSinOut)
        .attr('y', (d, i) => {
          let y;
          if (stacked) {
            y = scaleY(d.value1);
          } else {
            y = +d.value > 0 ? scaleY(d.value) : scaleY(0);
          }
          return y;
        })
        .attr('height', d => {
          let h = stacked ? height - scaleY(d.value1 - d.value0) : hasNegativeValue ? Math.abs(scaleY(d.value) - scaleY(0)) : height - scaleY(d.value);
          h = h < 1 ? 1 : h;
          return h;
        });
    } else {
      rects
      .attr('data-series', d => d.series)
        .attr('class', 'mc-chart--item')
      .attr('height', d => {
          let h = stacked ? scaleY.bandwidth() : scaleY1.bandwidth();
          h = h < 1 ? 1 : h;
          return h;
      })
      .attr('y', (d, i) => {
          let y = stacked ? scaleY(d.series) : scaleY1(d.series);
          y = isNaN(y) ? 0 : y;
          return y;
      })
      .attr('fill', d => d.color ? d.color : color(colorBySize ? d.value : d.series))
      .attr('title', d => d.title || `${d.series}: ${d.value}`)
      .attr('x', !hasNegativeValue ? 0 : scaleX(0))
      .attr('width', 0)
      .transition()
      .duration(duration)
      .ease(d3.easeSinOut)
      .attr('x', d => {
          let x;
          if (stacked) {
              x = scaleX(d.value1);
          } else {
              x = +d.value > 0 ? hasNegativeValue ? scaleX(0) : scaleX(minX) : scaleX(d.value);
          }
          return x;
      })
      .attr('width', d => {
          let w = stacked ? scaleX(d.value1 - d.value0) : hasNegativeValue ? Math.abs(scaleX(d.value) - scaleX(0)) : scaleX(d.value);
          w = w < 1 ? 1 : w;
          return w;
      });
    }
  }
}
