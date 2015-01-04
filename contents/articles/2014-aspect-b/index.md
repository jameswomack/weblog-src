---
title: 2014, Aspect B
author: jimkang
date: 2015-01-04
template: article.jade
---

<style>
li p {
  margin-bottom: 0.5em;
}

li {
  line-height: 1.3em;
  padding-left: 0;
}

ul {
  margin-top: 0.5em;
}

ul li ul li {
  font-size: smaller
}

.aside {
  border: 1px gray dotted;
  font-size: smaller;
  padding: 1em;
  color: #777;
}

</style>

While the year's activities were [dominated](../2014-aspect-a/) by Life Events, I did get some projects done. More than I did in 2013, I think. When I was looking at [Darius's list](https://gist.github.com/dariusk/aa4fc2da6f47eaed63db), I realized I couldn't remember what I had done beyond the last three months. So, taking stock is a good idea.

<span class="more"></span>

Projects that were released in 2014. If a project has subprojects built to support it, they are listed under it.

- [Recovery](https://soundcloud.com/isilence/recovery). I can't believe it, but this was the only song I wrote this year. I usually do two or three a year, except years in which I do albums. Maybe I'll go for an album this year.
- [probable](https://github.com/jimkang/probable). A [Node](http://nodejs.org/) module that provides basic randomization utilities, as well as functions for making D&D-style random tables. Those have been handy in quite a few projects!
- [Non-Stop Scroll Shop](http://nonstopscrollshop.com/). It's your one-stop non-stop scroll shop! Products forever!
- [A browser-based cellular automaton](http://jimkang.com/reactivecell/example/liquid.html). I had big, yet vague plans for building off of this, but I just kinda drifted away into Twitter bots. I'll come back, though!
  - [reactivecell](https://github.com/jimkang/reactivecell)
  - [cellseriesviewer](https://github.com/jimkang/cellseriesviewer)
  - [roguemap-parse-stream](https://github.com/jimkang/roguemap-parse-stream)
  - [cellgridrenderer](https://github.com/jimkang/cellgridrenderer)
  - [cellmap](https://github.com/jimkang/cellmap)

  <div class="aside">You may notice that a lot of modules go into most of my projects. This is because I've drifted into [small module philosophy](http://substack.net/how_I_write_modules), and it has worked out really well for my projects. If you have to start and stop projects a lot, as I do, it really helps to be able to build in small, tangible units, rather than huge all-or-nothing colossuses.</div>
- [An interactive explanation of quadtrees](http://jimkang.com/quadtreevis). When I was building my cellular automaton, I wanted to try storing my cells in quadtrees to save space. It was then that I realized I wasn't that clear on how quadtrees work, so I built this explanation. It was pretty well-received!
  - [quadtreevis](https://github.com/jimkang/quadtreevis)
  - [quadtreetree](https://github.com/jimkang/quadtreetree)
  - [quadtreemap](https://github.com/jimkang/quadtreemap)
  - [at](https://github.com/jimkang/one-at)
- [Smidgeo.com](http://smidgeo.com/). Finally our cat's corporation has a base on the web! GET! I still enjoy that CSS animation.
  - [scrollwatcher](https://github.com/jimkang/scrollwatcher)
  - [gravitybox](https://github.com/jimkang/gravitybox) - This powers the very busy [Smidgital Digital Plan](http://smidgeo.com/plan/).
- [@godtributes](https://twitter.com/godtributes). This is a merciless generalization of the "BLOOD FOR THE BLOOD GOD!" meme. I wasn't really into it until my friend [Matt](http://nynex.hydrogenproject.com/) said "GROWTH FOR THE GROWTH GOD!" in reference to House Republicans. Then, it clicked.

  Likewise, bot has similarly clicked with far more people than I had expected! I think it might the most popular project I've put out there. I learned quite a lot about inconsistencies in pluralization in the English language, the Twitter REST API rate limits, and just how easy it is for a bot to unintentionally say horrific things.
  - [iscool](https://github.com/jimkang/iscool)
  - [canonicalizer](https://github.com/jimkang/canonicalizer)
  - [chronicler](https://github.com/jimkang/chronicler)
  - [emojisource](https://github.com/jimkang/emojisource)
  - [nounfinder](https://github.com/jimkang/nounfinder)
  - [wordnok](https://github.com/jimkang/wordnok)
- Phoneme-based Node modules: [homophonizer](https://github.com/jimkang/homophonizer), [phonemenon](https://github.com/jimkang/phonemenon). Some of my future projects hinge on knowing what sounds like what what, and so, I've done a lot of playing around with phonemes. I need to harvest the fruit of these projects in 2015.
- Translation bots: [@a_chance_bot](https://twitter.com/a_chance_bot), [@translatedbible](https://twitter.com/translatedbible), and [@new_aeneid](https://twitter.com/new_aeneid). These are bots (working off of the [same app](https://github.com/jimkang/lossyfortunes)) that take some source quotation, then translates it to several non-English languages, then back to English. The results have been largely disappointing, though I am amused by at least one post from each of these bots a day.

  I started this project after watching a [Leslie Lamport video](https://www.youtube.com/watch?v=-4Yp3j_jk8Q) and then wrote a [rigorous specification](https://github.com/jimkang/lossyfortunes#specification), which I've never done before. That took a while. I also got a bikeshedding itch and made my own [dependency injector](https://github.com/jimkang/wardboss).

  In a sense, I made the classic mistake of investing too much engineering effort without first proving that doing so is worthwhile. However, I can also write this off as a chance to scratch some itches. On the whole, I still think I paid too much to do that.
- [conform-async](https://github.com/jimkang/conform-async). There's not much to this module, but I end up using it a lot to keep peace between async-expecting code and sync code.
- Rap bots: [@rapgamemetaphor](https://twitter.com/rapgamemetaphor) and [@autocompleterap](https://twitter.com/autocompleterap). These bots amuse me on the regular. I have some further plans for them.
  - [autocompl](https://github.com/jimkang/autocompl) - A module that gives you Google's autocomplete suggestions for given strings.
- [Lone Wolf and Parenting](http://lonewolfandparenting.tumblr.com/). I've been rereading Lone Wolf and Cub, a great but flawed comic from the '70s. This time, the parent stuff jumps out at me a little more, and I've been highlighting amusing stuff on this Tumblr. It's nice having a non-technology-driven project.

Projects that didn't make it:

- Massachusetts Childcare Search. While we were searching for daycare, I wanted a site that served the EEC data in a less painful way than the EEC web site. So, I [scraped the site for data](http://masschildcaredata.github.io/) and was planning to build an app that would use that data. Never got beyond the scraping.
- [NaNoGenMo](https://github.com/dariusk/NaNoGenMo-2014). I [started building an engine](https://github.com/jimkang/novelrrbot) for generating a novel, but I got stuck on trying define what an "event" in a novel is and how it could be represented simply. Might keep at this one.

I feel good about 2014 (the projects, not the world events), in light of all the other stuff that went on that year. As I do every year, in 2015, I want to be more careful about what I start and clearer on what I expect to get out of each project. And I want to do more with music and visualization again. And maybe finally write a game I enjoy.
