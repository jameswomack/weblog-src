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

<svg width="800" height="600">
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
    <path xmlns="http://www.w3.org/2000/svg" id="curve2" d="M 10 100 C 200 30 300 250 350 50" stroke="black" fill="none" stroke-width="5"/>

  </g>
  <g id="static-layer">
    <g>
      <rect id="reader" x="30" y="180" width="140" height="120" fill="hsla(0, 100%, 0%, 0.0)" stroke-width="1" stroke="#888" />
      <rect class="rim" x="20" y="170" width="160" height="40" fill="green"></rect>
      <rect class="rim" x="20" y="280" width="160" height="40" fill="green"></rect>
    </g>
    <rect id="parser" x="275" y="0" width="100" height="100" fill="green"></rect>
    <rect id="renderer" x="525" y="225" width="100" height="100" fill="blue"></rect>
  </g>
  <g id="block-layer">
  </g>

</svg>  

Not every object benefits from being hit with a hammer, and some situations benefit less than others from having a streaming pattern applied.

<script type="text/javascript" src="d3.v3.js"></script>
<script type="text/javascript" src="gravitybox.js"></script>
<script type="text/javascript" src="pathanimator.js"></script>
<script type="text/javascript" src="flowcontroller.js"></script>
