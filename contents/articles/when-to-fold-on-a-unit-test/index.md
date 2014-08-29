---
title: When to fold on a unit test
author: jimkang
date: 2014-08-27
template: article.jade
---

Unit tests are snappy and reassuring. They're an easy way to find out what's wrong fast. However, not all code is amenable to unit testing. And so, you may find yourself bending over backwards to make your code amenable to unit testing. Oft times, this is good for your code. Other times, though, it contorts it in unhealthy ways.

<span class="more"></span>

(This post is quite meandering, and in fact, changes viewpoints as it progresses. So, a warning: This is neither a handy how-to nor a tight manifesto.)

Unit tests are intended to test only a specific "unit" of code, like a method in an object or module. A unit test should only test one unit, not that unit's dependencies. Thus, the unit is given mock versions of the dependencies to use, rather than the real versions. If you don't do this, I've found that you end up with:

- Hard-to-debug test failures in the case caused the behavior of a dependency or even worse, that of a dependency of a dependency of a dependency.

- Redundant test targeting. More than one test will test the same code paths because of the implicit exercising of dependencies.

  This might sound good, but it's like having ten different people tell you that you've got dried toothpaste on your face. Better that you have one go-to guy for telling you that you have toothpaste on your face. The other nine guys, instead of telling you have toothpaste on your face and stopping, can instead tell you about other things, like that you forgot to wear pants.

- Onerous test setups that often cannot be understood by looking at the test file only.

That's why I now bother to mock things instead of running everything for real all the time. (If you can get away with it, it's fine. I have, on a couple of projects.)

There's times where it's not worth it, though. Here's one I ran into.

I'm starting an edit control maker called [editize](https://github.com/jimkang/editize). It wraps a DOM element to create a control that modifies the element so that it's editable at the appropriate times.

The control goes into edit mode when clicked or tapped and exits edit mode when the user clicks outside of the control *or* when they hit the enter key. Clients of this control can specify an event handler that will be called when editing ends.

It's easy to unit test the case in which editing exits via a click outside the control. DOM elements receive a `blur` event when they lose focus. So, you can create a mock element like this:

    function createMockDOMElement() {
      var blurEventListener;

      return {
        addEventListener: function mockAddEventListener(type, listener) {
          if (type === 'blur') {
            blurEventListener = listener;
          }
        },
        mockBlur: function mockBlur() {
          if (blurEventListener) {
            blurEventListener();
          }
        }
      }
    }

And call `mockBlur` to simulate a blur event, which will then call the control's blur event listener. The test will verify that the control then calls the `endEdit` event handler.

--

However, the other case is not as simple to mock: edit mode ending when the user hits the 'Enter' key . If I want to use a module like [strokerouter](https://github.com/jimkang/strokerouter) to listen for keystrokes, I then have to mock strokerouter. strokerouter, however, uses [D3](http://d3js.org) to listen for events. It does not take D3 as a constructor argument (because that would be bizarre), so D3 would have to be mocked on the global scope. Either that, or strokerouter's constructor would have to be modified to accept D3 as an argument.

Either way, the following methods and properties would need to be stubbed:

- d3.event.stopPropagation
- d3.event.which
- D3 selection object's `on`
- D3 event trigger

Certainly, that's not a Herculean effort, but at that point, it is more of a test of `strokerouter` than it is of the control. If you have to go this far, it's not worth unit testing. You are going to get poor value for effort, and either the app code or test code is going to puzzle you the next time you look at it. Better to just use functional or manual tests to cover this.

<h1>BRAKE SCREECH</h1>
In the course of writing the last few paragraphs, I realized a couple of things:

- **strokerouter shouldn't use D3.** There's no need for it. It uses it because it was extracted from [Sprigot](http://sprigot.com), which is built on D3, but there's nothing particularly D3 about listening for keystrokes and calling event handlers.

- **editized controls don't need strokerouter at all.** It's listening for one particular keyup event; there's no complex keystroke routing going on here. Just setting up an event handler for the DOM element's `keyup` event is sufficient. And doing that makes the end-edit-via-enter case just as easy as the end-edit-via-clicking-outside case.

OK, well, that was a U-turn of a post, but better to figure something out while writing than not at all.

I really have come across plenty of situations in which the cost of writing a unit test is higher than the value of unit testing it, though. It just happens that one I decided to examine was a false positive. [shrug!]



