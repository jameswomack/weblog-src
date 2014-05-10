---
title: Between 480,000 and 960,000
author: jimkang
date: 2014-05-10
template: article.jade
---

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

Not every object benefits from being hit with a hammer, and some situations benefit less than others from having a streaming pattern applied.
