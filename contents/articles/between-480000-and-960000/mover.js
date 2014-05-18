function createMover() {
  var idmaker = createIdmaker();
  var bezierFactory = d3.svg.diagonal();

  // opts:
  // text: The text to move.
  // layer: Selection of layer on which to add textpath.
  // source: Object with x and y of start point.
  // target: Object with x and y of end point.
  // duration: Duration of animation in milliseconds.
  // done: The function to call when the move is complete.

  // Assumes there is a 'defs' element.
  function moveTextAlongCurve(opts) {
    if (!opts.duration) {
      opts.duration = 2000;
    }
    if (!opts.delay) {
      opts.delay = 0;
    }

    var pathId = 'path-' + idmaker.randomId(8);
    var textpathId = 'text-' + pathId;

    var path = d3.select('defs').append('path').attr({
      id: pathId,
      stroke: 'blue',
      strokeWidth: '2px',
      d: bezierFactory({source: opts.source, target: opts.target})
    });

    var textRendition = opts.layer.append('text').text(opts.text)
      .attr('transform', function translate(d) {
        return 'translate(' + opts.source.x + ', ' + opts.source.y + ')';
      });

    textRendition
      .transition()
        .duration(opts.duration)
        .delay(opts.delay)
        .attrTween('transform', translateAlong(path.node()));

    function cleanUp() {
      path.remove();
    }

    if (opts.done) {
      setTimeout(function callDone() {
        opts.done(textRendition);
      }, 
      opts.duration + 1000);
    }
    setTimeout(cleanUp, opts.duration);
  }

  // http://bl.ocks.org/mbostock/1705868
  // Returns an attrTween for translating along the specified path element.
  function translateAlong(path) {
    var l = path.getTotalLength();
    return function(d, i, a) {
      return function(t) {
        var p = path.getPointAtLength(t * l);
        return "translate(" + p.x + "," + p.y + ")";
      };
    };
  }

  return {
    moveTextAlongCurve: moveTextAlongCurve
  };
}
