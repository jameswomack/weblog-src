---
title: Writing Chrome Extensions and bookmarklets that mess with the DOM
author: jimkang
date: 2013-04-01
template: article.jade
---

Let's say you want to mess with a web page that you didn't author. You want to see the New York Times in Comic Sans. Or you want to only see the last letter of every paragraph in Ars Technica articles to see if there's some secret message. Or perhaps something useful.

<span class="more"></span>
One way to do this is open the developer tools in your browser and just start messing with stuff. But if you want to let everyone else mess with web pages in the way you were thinking, that won't work. For quite a long time, people have been using Greasemonkey scripts to pass on the mischief to other Firefox users.

On Chrome, the analogue to that is Chrome Extensions. Then, there's also bookmarklets, which are a little less capable, but will work across all browsers.

Here's how'd you write a bookmarklet that alters the DOM.

![a banana](banana.png)
