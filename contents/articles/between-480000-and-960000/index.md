---
title: Between 480,000 and 960,000
author: jimkang
date: 2014-05-10
template: article.jade
---

<style>
  .tagbox {
    font-size: 32px;
  }

  .pipe {
    fill: hsla(0, 100%, 0%, 0.0);
    stroke-width: 1;
    stroke: #888;
  }

  svg {
    font-size: 20px;
  }

  svg text {
    fill: #5c5c5c;
  }

  .station {
    stroke: #777;
    stroke-width: 3;
    fill: #fff;
  }

  .station-label {
    font-size: 24px;
    text-align: center;
    text-anchor: middle;
  }

  #block-layer text {
    fill: hsl(0, 60%, 60%);
  }
</style>

I've been working on a [simple streaming parser](https://github.com/jimkang/roguemap-parse-stream) for plain text maps. While writing the browser example (I originally wrote it for Node), I began to wonder if I could use the [Power of Streaming](https://github.com/substack/stream-handbook) to use it to render some really huge maps.

<span class="more"></span>
I gave it a map file with about 16 million entities that were each to render to three SVG entities. After fiddling with each of the streams involved to make them respect backpressure, I was able to keep the browser responsive for a while while it rendered these entities. However, at some point, the page would inevitably become unresponsive and the tab would crash.

**Who to blame?**

I stepped away from the JavaScript and made a huge static HTML file. It has 960,000 SVG `<g>` elements, each containing a `<rect>` and `<text>` element.

Chrome 34.0.1847.131 quits on it ("Aw, Snap!" page) on a Mac running Mavericks with a 2.8 GHz Core i7 and 16 GB RAM. [You can try it yourself.](https://dl.dropboxusercontent.com/u/263768/lotsofelements.html)

(However, Chrome *will* successfully load a page with 480,000 `<g>`s!)

So, if you find yourself having to create this many elements via JavaScript, keep in mind that *the fans may scream because of sheer rendering stress, not necessarily because there's something wrong with your code.*

**Streaming into a lagoon**

I think there's a lesson here about streaming as well. Streams are about processing data a manageable chunk at a time, but if you can't dispose of those chunks after you're done with them, those chunks pool up, and the chunk-at-a-time benefit of streams is negated. 

In the situation I set up &mdash; piping a huge text file to a parser stream, then piping the parsed tokens to a renderer &mdash; streams of text were transformed into streams of token objects which were then transformed into SVG elements. But those SVG elements did not "pass through." They piled up in the DOM, eating up memory.

<a name="stream-overload-diagram-anchor"></a>

<svg width="800" height="600" id="stream-overload-diagram">
  <defs>
    <radialGradient id="sphere-gradient">
      <stop offset="0" stop-color="hsl(30, 100%, 80%)"/>
      <stop offset="0.75" stop-color="hsl(20, 100%, 60%)">
        <animate attributeName="offset" values="0.75;0.9;0.75" keySplines="0.1 0.8 0.2 1; 0.1 0.8 0.2 1; 0.1 0.8 0.2 1" dur="4s" repeatCount="indefinite" />
      </stop>
      <stop offset="1" stop-color="hsl(10, 100%, 50%)">
        <animate attributeName="stop-color" values="hsl(10, 100%, 50%);hsl(40, 100%, 70%);hsl(10, 100%, 50%)" keySplines="0.1 0.8 0.2 1; 0.1 0.8 0.2 1; 0.1 0.8 0.2 1" dur="4s" repeatCount="indefinite" />
      </stop>
    </radialGradient>

    <linearGradient id="pipe-gradient" x1="0" y1="0" x2="100%", y2="0">
      <stop offset="0" stop-color="hsl(200, 100%, 10%)" />
      <stop offset="0.5" stop-color="hsl(180, 100%, 20%)">
        <animate attributeName="offset" values="0.5;0.9;0.5" keySplines="0.1 0.8 0.2 1; 0.1 0.8 0.2 1; 0.1 0.8 0.2 1" dur="10s" repeatCount="indefinite" />
      </stop>
      <stop offset="1" stop-color="hsl(200, 100%, 30%)">
      </stop>
    </linearGradient>
  </defs>
  <g class="background-layer">
  </g>
  <g id="chunk-layer">
  </g>
  <g id="static-layer">
    <g>
      <rect id="reader" x="30" y="300" width="200" height="120" 
      class="station" />
      <text x="30" dx="4.2em" y="300" dy="2.8em" width="200" class="station-label">Internet requester</text>
    </g>

    <g>
      <path d=" M 250 4
                L 440 4
                L 345 154
                Z"
            class="station"
            id="parser" x="250" y="4" width="100" height="100" />
      <text x="250" y="4" dx="4em" dy="2.35em" class="station-label">Parser</text>
    </g>

    <g>
      <circle id="renderer" x="525" y="175" width="150" height="150"
      r="75" cx="600" cy="250" class="station"></circle>
      <text x="525" y="175" dx="3.1em" dy="2.25em" class="station-label">Renderer</text>
    </g>
  </g>
  <g id="block-layer">
  </g>

</svg>  

Not every object benefits from being hit with a hammer, and some situations benefit less than others from having a streaming pattern applied.

<script src="d3.v3.js"></script>
<script src="scrollwatcher.js"></script>
<script src="gravitybox.js"></script>
<script src="idmaker.js"></script>
<script src="mover.js"></script>
<script src="flowcontroller.js"></script>
