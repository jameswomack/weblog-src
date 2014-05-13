function flowController(opts) {
  var readerBox = d3.select('#reader');
  var parserBox = d3.select('#parser');
  var rendererBox = d3.select('#renderer');

  if (!opts.delay) {
    opts.delay = 500;
  }

  function pickFromArrayAtRandom(array) {
    return array[~~(Math.random() * array.length)];
  }

  var idChars = 
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

  // Creates a string of random characters of the length specified.
  function randomId(len) {
    var id = '';
    for (var i = 0; i < len; ++i) {
      id += pickFromArrayAtRandom(idChars);
    }
    return id;
  }

  var gravitybox = createGravityBox({
    root: d3.select('#block-layer'),
    width: 800,
    height: 600,
    r: 18,
    nodeClass: 'tagbox',
    nodeElementName: 'text',
    xAttr: 'x',
    yAttr: 'y',
    processSelection: function setText() {
      d3.select(this).text('<rect />');
    }
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
      duration: 1000, 
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
      duration: 1000,
      delay: tokenNumber * opts.delay,
      done: this.done
    });
  }

  function blockForToken(token) {
    gravitybox.add([
      {
        x: +token.attr('x') + token.attr('width')/2,
        y: token.attr('y'),
        attrs: {
          // r: 30,
          width: 30,
          height: 30,
          fill: '#666'
        }
      }
    ]);
    gravitybox.render();
  }

  function tokenToBlock(token) {
    var block = blockForToken(token);
    token.remove();

    return block;
  }

  function dropTextIntoBox(box, text, done) {
    var boxX = +box.attr('x');

    var rendition = opts.chunkLayer.append('text')      
      .attr({
        x: boxX + readerBox.attr('x')/2,
        y: 0
      });

    var words = text.split(' ');
    words.forEach(function appendSpan(word) {
      rendition.append('tspan').text(word).attr({
        x: boxX + readerBox.attr('x')/2,
        dy: '1em'
      });      
    });

    moveThing({
      thing: rendition,
      dest: [boxX, +box.attr('y') + box.attr('height')/3],
      duration: 1000,
      done: done
    });
  }

  function putWordInBox(box, text) {
    var readerX = +box.attr('x');
    var middleOfReaderY = +box.attr('y') + box.attr('height')/2;

    return opts.chunkLayer.append('text')
      .text(text)
      .attr({
        x: readerX,
        y: middleOfReaderY,
        dy: '1em'
      });
  }

  function feedWordIntoFlow(theWord) {
    var word = putWordInBox(readerBox, theWord);

    function explodeWord() {
      var tokens = breakWordIntoTokens(word);
      tokens.forEach(flingTokenToRendererBox.bind({done: tokenToBlock}));
    }
    
    moveWordIntoParserBox(word, explodeWord);
  }

  function addWordGroups() {
    var groupsOfWordsAdded = 0;

    function addWords() {
      var wordsAdded = 0;

      function addWord() {
        feedWordIntoFlow(randomId(10));
        wordsAdded += 1;
        if (wordsAdded > 5) {
          clearInterval(wordIntervalKey);
        }
      }

      addWord();
      var wordIntervalKey = setInterval(addWord, 4000);

      if (groupsOfWordsAdded > 2) {
        clearInterval(groupIntervalKey);
      }
    }

    addWords();
    var groupIntervalKey = setInterval(addWords, 30000);
  }

  var internetResponses = 0;
  function renderInternetResponse() {
    dropTextIntoBox(readerBox, 'Response from Internet!', addWordGroups);
    internetResponses += 1;
    if (internetResponses > 2) {
      clearInterval(internetKey);
    }
  }

  renderInternetResponse();
  var internetKey = setInterval(renderInternetResponse, 60000);
  
  return {
  };
}

var theFlowController = flowController({
  chunkLayer: d3.select('#chunk-layer'),
  blockLayer: d3.select('#block-layer')
});
