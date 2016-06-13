// import { d3 } from 'd3';
import d3 from 'd3';
import 'd3-scale';
import { getSolution } from './dimensionalReduction';
import d3Tip from 'd3-tip';
d3.tip = d3Tip;

export function drawScatter(taxaNames, data) {
  document.getElementById('embed').innerHTML = '';

  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const width = window.innerWidth - 50 - margin.left - margin.right;
  const height = window.innerHeight - 220 - margin.top - margin.bottom;

  const x = d3.scale.linear()
    .range([ 0, width ])
    .nice();

  const y = d3.scale.linear()
    .range([ height, 0 ])
    .nice();

  x.domain([
    d3.min(data, function (d) { return d[0]; }),
    d3.max(data, function (d) { return d[0]; }),
  ]);

  y.domain([
    d3.min(data, function (d) { return d[1]; }),
    d3.max(data, function (d) { return d[1]; }),
  ]);

  const chart = d3.select('#embed')
    .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'chart')
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(
        d3.behavior.zoom()
          .x(x).y(y)
          // .scaleExtent([ 1, 8 ])
          .on('zoom', zoomFunction)
      );

  // to capture zooming...
  chart.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all'); // the key!!!!!

  function zoomFunction() {
    chart.selectAll('.scatter')
      // .attr('transform', (d) => 'translate(' + x(d[0]) + ',' + y(d[1]) + ')');
      .attr('transform', 'translate(' +  d3.event.translate + ')' + ' scale(' + d3.event.scale + ')');
  }

  // const xAxis = d3.svg.axis()
  //   .scale(x)
  //   .orient('bottom');

  // main.append('g')
  //   .attr('transform', 'translate(0,' + height + ')')
  //   .attr('class', 'main axis date')
  //   .call(xAxis);

  // const yAxis = d3.svg.axis()
  //   .scale(y)
  //   .orient('left');

  // main.append('g')
  //   .attr('transform', 'translate(0,0)')
  //   .attr('class', 'main axis date')
  //   .call(yAxis);

  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([ -10, 0 ])
    .html( (d, i) => taxaNames[i] + '</br>' + pointHeaderInfo(taxaNames[i]) );

  chart.call(tip);

  const g = chart.append('g');

  g.selectAll('.scatter') // what actually is .scatter????
    .data(data)
    .enter().append('circle')
      .classed('scatter', true)
      .attr('cx', function (d) { return x(d[0]); } )
      .attr('cy', function (d) { return y(d[1]); } )
      .attr('r', 4)
      .style('fill', pointColour.bind(this, taxaNames))
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);


  // g.selectAll('circle')
  //   .data(data)
  //   .enter().append('text')
  //     .attr('text-anchor', 'top')
  //       .attr('x', function (d, i) { return x(d[0]); } )
  //       .attr('y', function (d, i) { return y(d[1]); } )
  //       .attr('font-size', 12)
  //       .attr('fill', '#333')
  //       .text((d, i) => taxaNames[i]);

  return ({ x, y });
}

/* function to change the colour of the data points */
export function updateScatter(taxaNames) {
  // console.log('updateScatter triggered');
  if (taxaNames && window.roaryFile) {
    d3.select('#embed')
      .selectAll('.scatter') // what actually is .scatter????
      .data(getSolution())
        // .transition().duration(1000)
        .style('fill', pointColour.bind(this, taxaNames));
  }
}

/* functino to update the position of the data points (because the underlying data has changed) */
export function updateScatterData(taxaNames, data, d3info) {
  d3info.x.domain([
    d3.min(data, function (d) { return d[0]; }),
    d3.max(data, function (d) { return d[0]; }),
  ]);

  d3info.y.domain([
    d3.min(data, function (d) { return d[1]; }),
    d3.max(data, function (d) { return d[1]; }),
  ]);

  d3.select('#embed')
    .selectAll('.scatter') // what actually is .scatter????
      .data(data)
      // .transition().duration(100)
      .attr('cx', function (d) { return d3info.x(d[0]); } )
      .attr('cy', function (d) { return d3info.y(d[1]); } );
}


function pointColour(taxaNames, d, i) {
  // console.log('pointColour triggered. Col:', window.metadata.colToUse);
  // console.log(window.metadata)
  if (!window.metadata) {
    return 'steelblue';
  }
  const j = window.metadata.colToUse;
  const taxa = taxaNames[i];
  if (!window.metadata.data[taxa] || window.metadata.data[taxa][j] === undefined) { // taxa may not have metadata!
    return 'steelblue';
  }
  let colour;
  if (window.metadata.info[j].inGroup) {
    colour = window.metadata.groups[window.metadata.info[j].groupId].colours[window.metadata.data[taxa][j]];
  } else {
    colour = window.metadata.colours[j][window.metadata.data[taxa][j]];
  }
  const rgb = d3.rgb(colour);
  // console.log('taxa', taxa, '->', colour, '->', rgb);
  return rgb;
}

function pointHeaderInfo(taxon) {
  if (!window.metadata || !window.metadata.data[taxon]) {
    return '';
  }

  const headerIdx = window.metadata.colToUse;
  const valueIdx = window.metadata.data[taxon][headerIdx];

  let value;
  if (window.metadata.info[headerIdx].inGroup) {
    const groupId = window.metadata.info[headerIdx].groupId;
    value = window.metadata.groups[groupId].values[valueIdx];
  } else {
    value = window.metadata.values[headerIdx][valueIdx];
  }

  return value;
}


