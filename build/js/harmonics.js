(function() {

  var outerWidth = 900;
  var outerHeight = 900;
  var margin = 10;
  var height = outerHeight - (2 * margin);
  var width = outerWidth - (2 * margin);

  var fretHeight = 20;
  var fretWidth = 1;
  var stringWidth = 1;
  var dotDistance = 20;
  var dotWidth = 2;
  var doubleDotSpacing = 6;
  var sampleRate = 100;

  var svg = d3.select('#fretboard')
      .append('svg')
      .attr('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight)
      .attr('preserveAspectRatio', 'xMidYMin slice')
      .attr('width', '100%')
      .style('padding-bottom', '75%')
      .style('height', '1px')
      .style('overflow', 'visible')
    .append('g')
      .attr('transform', 'translate(' + margin + ', ' + margin + ')');

  var fretboard = svg.append('g')
      .attr('transform', 'translate(0, ' + (height / 2) + ')');

  fretboard.append('line')
      .classed('string', true)
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke-width', stringWidth)
      .attr('stroke', 'black');

    fretboard.append('line')
      .classed('nut', true)
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', -(fretHeight / 2))
      .attr('y2', fretHeight / 2)
      .attr('stroke-width', fretWidth)
      .attr('stroke', 'black')

  fretboard.append('line')
      .classed('bridge', true)
      .attr('x1', width)
      .attr('x2', width)
      .attr('y1', -(fretHeight / 2))
      .attr('y2', fretHeight / 2)
      .attr('stroke-width', fretWidth)
      .attr('stroke', 'black')
 
  fretboard.append('g')
      .classed('frets', true)
      .selectAll('.fret')
      .data(d3.range(1, 25))
      .enter()
    .append('line')
      .classed('fret', true)
      .attr('x1', function(d) {
        return getLocation(d, 12);
      })
      .attr('x2', function(d) {
        return getLocation(d, 12);
      })
      .attr('y1', -(fretHeight / 2))
      .attr('y2', fretHeight / 2)
      .attr('stroke-width', fretWidth)
      .attr('stroke', 'black');

  fretboard.append('g')
      .classed('dots', true)
      .selectAll('.dot')
      .data([5, 9, 13, 17, 29, 33, 37, 41])
      .enter()
    .append('circle')
      .attr('cx', function(d) {
        return getLocation(d, 24);
      })
      .attr('cy', dotDistance)
      .attr('r', dotWidth)
      .attr('fill', 'black');

  var doubleDots = fretboard.append('g')
      .classed('double-dots', true);

  doubleDots.selectAll('.top-dot')
      .data([23, 47])
      .enter()
    .append('circle')
      .attr('cx', function(d) {
        return getLocation(d, 24)
      })
      .attr('cy', dotDistance - (doubleDotSpacing / 2))
      .attr('r', dotWidth)
      .attr('fill', 'black');

  doubleDots.selectAll('.bottom-dot')
      .data([23, 47])
      .enter()
    .append('circle')
      .attr('cx', function(d) {
        return getLocation(d, 24);
      })
      .attr('cy', dotDistance + (doubleDotSpacing / 2))
      .attr('r', dotWidth)
      .attr('fill', 'black');

  fretboard.append('g')
      .classed('waves', true)
      .selectAll('.wave')
      .data(d3.range(1, 9).reverse())
      .enter()
    .append('path')
      .classed('wave', true)
      .attr('d', getWavePath)
      .attr('fill', 'none')
      .attr('stroke', d3.scale.category10());

  function getLocation(index, divisions) {
    var frequencyCoefficient = Math.pow(2, (index / divisions));
    var distance = (1 / frequencyCoefficient) * width;
    return width - distance;
  }

  function getWavePath(d) {
    var waveHeight = (1 / d) * (height / 2);
    var path = 'M 0 0 ';
    d3.range(0, sampleRate + 1).forEach(function(i) {
      var x = (width / sampleRate) * i;
      var radianValue = (x / width) * (Math.PI);
      var y = Math.sin(radianValue * d) * waveHeight;
      path += 'L ' + x + ' ' + -y + ' ';
    });
    return path + 'Z';
  }
})();
