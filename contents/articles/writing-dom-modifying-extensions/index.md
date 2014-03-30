---
title: Writing Chrome Extensions and bookmarklets that mess with the DOM
author: jimkang
date: 2014-03-30
template: article.jade
---

Let's say you want to vandalize with a web page that you didn't author. You want to see the New York Times in Comic Sans. Or you want to show only the last letter of every paragraph in the [HIG](https://developer.apple.com/library/mac/documentation/UserExperience/Conceptual/AppleHIGuidelines/Intro/Intro.html) to see if there's some [secret message](http://en.wikipedia.org/wiki/Bible_code). Or perhaps you want to do something useful with the web page.

<span class="more"></span>
One way to do this is open the developer tools in your browser and directly change things in the [DOM](https://developer.mozilla.org/en-US/docs/DOM). But if you want the world to also be able to do the same, you need to ship a program that does it. For quite a long time, people have been used [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) scripts in Firefox deliver them.

On Chrome, [Chrome extensions](http://developer.chrome.com/extensions/index) do this. There's also [bookmarklets](http://en.wikipedia.org/wiki/Bookmarklet), which are less capable but will work across all browsers.

Here's a look at what it takes to make a DOM-altering Chrome extension or bookmarklet. (If you know that what you want to do is make a bookmarklet, though, I recommend you just [skip down to the content script and bookmarklet parts](#contentscript).)

<h1>Extension structure</h1>

A Chrome extension is a package of JavaScript, CSS, and resource files. They're balled up into a crx file on the Chrome Web Store, but in development, you can load an unpacked directory in [chrome://extensions](chrome://extensions).

There's a [manifest.json](http://developer.chrome.com/extensions/manifest) that you need to fill out. Salient fields:

    "permissions": [
      "https://twitter.com/*"
    ],

This tells Chrome that this extension will operate on pages that have URLs that begin with `https://twitter.com`.

    "browser_action": {
        "default_icon": {
          "19": "onebyone_icon_19.png",
          "38": "onebyone_icon_38.png"
        }
      },

If you specify a `browser_action` field, Chrome will put a button in the toolbar for you using the image files you specify. There's a button click event your script can listen for. You can use this to do something when the user clicks your extension's button.

    "background": {
      "scripts": ["node_modules/scriptchain/scriptchain.js", "background.js"],
      "persistent": false
    },

Here, we're specifying the [background scripts](https://developer.chrome.com/extensions/background_pages) we want to have at the ready to respond to user-instigated events. Usually, I have a background.js file which listens for clicks to the extension's button, then executes scripts in the context of the active tab. Executing scripts in the context of the active tab is kinda like going to the web page you want to mess with, then running code in the JavaScript console.

Background script example:

    var scriptchain = createScriptChain(
      ['readability.js', 'parser.js', 'onebyone.js'], null, false
    );

    chrome.browserAction.onClicked.addListener(function respondToClick(tab) {
      scriptchain.loadChain();
    });

It's registering for the `chrome.browserAction.onClicked` event and responding to that event by calling `scriptchain.loadChain`. [scriptchain](https://www.npmjs.org/package/scriptchain) is a helper I wrote that runs a list of scripts on the active tab in order. It's a convenience, but alternatively, you can call [chrome.tabs.executeScript](http://developer.chrome.com/extensions/tabs#method-executeScript) to run your scripts on the tab.

To sum up, the flow of execution goes like this:

0. User visits a page that is included in the manifest's `permissions` property.
1. Chrome loads the background scripts you specified in the manifest. One of them subscribes to the browser button click event.
2. User clicks on the extension button in the Chrome toolbar.
3. The background script gets the event and responds by executing a script in the context of the tab.
4. That script does some cool stuff with the web page in the tab.

<a name="contentscript"></a>
<h1>The content script: Actually doing stuff to the web page, finally</h1>

Once you're finally executing code in the context of the web page, it's a lot like being at a web page, opening the Web Inspector console, and running code. This is where you do your business, so to speak.

Typically, you want to select DOM elements, read them and then change them or add to them or delete them. You may want to avoid including a big library like jQuery that abstracts that kind of thing in order to keep things light, especially if you're going to be creating a bookmarklet version of your extension. Fortunately, the DOM API, while clunkier, is [not really all that different](https://developer.mozilla.org/en-US/docs/Web/API/document.querySelectorAll) from the abstraction libraries these days.

Here's an example from [Twitter Shuffle](http://jimkang.com/twittershuffle/), an extension and bookmarklet I wrote to shuffle around tweets and their authors for some misattribution fun and confusion. ([The unabridged file is here.](https://github.com/jimkang/twitter-shuffle-chrome-extension))

    ((function shuffleTweets() {
      ...

      var tweetTexts = document.querySelectorAll('.tweet-text');
      var tweetContents = [];
      tweetTexts.forEach(function getContents(tweet) {
        tweetContents.push(tweet.innerHTML);
      });
      var shuffledContents = shuffle(tweetContents);

      tweetTexts.forEach(function replaceWithShuffled(tweetText, i) {
        tweetText.innerHTML = shuffledContents[i];
      });

    })());

Here is where you'd do the thing you want to do with the web page. You could do anything here. It's like a [Zombo.com](http://html5zombo.com/) inside of that [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/).

<a name="bookmarkletize"></a>
<h1>Bookmarkletize</h1>

So, how would this work as a bookmarklet? You just have get a bookmark created on your users' browsers that has a URL that looks like this:

    javascript:<Your IIFE>

You can't really tell most users "copy this code, then edit a bookmark and paste it into the URL field." You need to create a web page that has a link that contains your code in the `href` and tell them to drag it to the bookmarks bar. Like this:

    <p>Drag this to your bookmarks bar:</p>      
    <p>
      <a class="bookmarklet" href="javascript:<Your IIFE">Greatest Bookmarklet of All Time!</a>
    </p>

It'd be great if bookmarklet installation could be even simpler (some people don't have their bookmarks bar showing), but I think it's the best we can do for now.

To squeeze your IIFE into an `href`, you'll need to crunch it down to one line Minification wouldn't hurt, either. You can do it by hand, but I recommend your run it through [UglifyJS](https://github.com/mishoo/UglifyJS2). On a Mac, you do this:

    uglifyjs yourcontentscript.js -m | pbcopy

The minified code will be in your pasteboard. You can cmd+V it into your `href="javascript:"`.

<h1>Why even bother with a Chrome extension, then?</h1>

Well, there's stuff you can do in a Chrome extension that you can't do in a bookmarklet. Chrome extensions are also easier to install. At least on Chrome. But yeah, if you know you don't need any of that, just make a bookmarklet.
