function flowController(opts) {
  var readerBox = d3.select('#reader');
  var parserBox = d3.select('#parser');
  var rendererBox = d3.select('#renderer');

  if (!opts.delay) {
    opts.delay = 500;
  }

  var gravitybox = createGravityBox({
    root: d3.select('#block-layer'),
    width: 800,
    height: 600,
    nodeClass: 'node',
    nodeElementName: 'circle',
    xAttr: 'cx',
    yAttr: 'cy'      
  });

  function moveThing(moveOpts) {
    // Opts: thing, dest, duration, delay, done
    if (!moveOpts.delay) {
      moveOpts.delay = 0;
    }

    moveOpts.thing.transition()
      .duration(moveOpts.duration)
      .delay(moveOpts.delay)
      .attr({
        x: moveOpts.dest[0],
        y: moveOpts.dest[1]
      });

    if (moveOpts.done) {
      setTimeout(function passThingToCallback() {
        moveOpts.done(moveOpts.thing);
      },
      moveOpts.delay + moveOpts.duration);
    }
  }

  function moveWordIntoParserBox(word, done) {
    var parserCoords = [
      +parserBox.attr('x'), 
      +parserBox.attr('y') + parserBox.attr('height')/2
    ];

    moveThing({
      thing: word, 
      dest: parserCoords,
      duration: 1800, 
      done: done
    });
  }

  function breakWordIntoTokens(word) {
    function renderChar(char) {
      return opts.chunkLayer.append('text')
        .text(char)
        .attr({
          x: wordX,
          y: wordY
        });
    }

    var wordText = word.text();
    var wordX = word.attr('x');
    var wordY = word.attr('y');

    word.remove();
    return wordText.split('').map(renderChar);
  }

  function flingTokenToRendererBox(token, tokenNumber) {
    var rendererCoords = [
      +rendererBox.attr('x'), 
      +rendererBox.attr('y') + rendererBox.attr('height')/2
    ];

    moveThing({
      thing: token, 
      dest: rendererCoords, 
      duration: 1800,
      delay: tokenNumber * opts.delay,
      done: this.done
    });
  }

  function blockForToken(token) {
    // return opts.blockLayer.append('rect').attr({
    //   x: token.attr('x'),
    //   y: token.attr('y'),
    //   width: 30,
    //   height: 30,
    //   fill: 'purple'
    // });
    gravitybox.render([
      {
        x: token.attr('x'),
        y: token.attr('y'),
        attrs: {
          r: 30,
          width: 30,
          height: 30,
          fill: 'purple'
        }
      }
    ]);
  }

  function tokenToBlock(token) {
    var block = blockForToken(token);
    token.remove();

    return block;
  }

  function init() {
    var readerX = +readerBox.attr('x');
    var middleOfReaderY = +readerBox.attr('y') + readerBox.attr('height')/2;

    var smidgeo = opts.chunkLayer.append('text')
      .text('smidgeo')
      .attr({
        x: readerX,
        y: middleOfReaderY,
        dy: '1em'
      });

    var xhrRendition = opts.chunkLayer.append('text')      
      .attr({
        x: readerX,
        y: 0
      });

    xhrRendition.append('tspan').text('Internet').attr('x', readerX);
    xhrRendition.append('tspan').text('Response!').attr({
      x: readerX,
      dy: '1em'
    });

    moveThing({
      thing: xhrRendition,
      dest: [readerX, middleOfReaderY],
      duration: 1800, 
      done: function kickOffWordMovement() {
        moveWordIntoParserBox(smidgeo, function explodeWord() {
          var tokens = breakWordIntoTokens(smidgeo);
          tokens.forEach(flingTokenToRendererBox.bind({done: tokenToBlock}));
        });
      }
    });
  }

  init();
  
  return {
  };
}

var theFlowController = flowController({
  chunkLayer: d3.select('#chunk-layer'),
  blockLayer: d3.select('#block-layer')
});
