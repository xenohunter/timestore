# timestore [![npm version](https://badge.fury.io/js/timestore.svg)](https://www.npmjs.com/package/timestore) [![downloads/month](https://img.shields.io/npm/dm/timestore.svg)](https://www.npmjs.com/package/timestore) [![PayPal donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GQ5TJ6PCRXS4Y)

Manage multiple collections of timers: set, clear, pause and resume them. Use it with your [game states](http://phaser.io/news/2015/06/using-states-tutorial).

## Installation

    $ npm install timestore

or, get a [browserified and minified version](https://cdn.rawgit.com/xenohunter/timestore/master/timestore.1.2.0.min.js).

Also, check out the [example page](https://xenohunter.github.io/timestore/).

## Quick Guide

Let's create a timestore:

    var gameTimers = new timestore.Timestore();

That's how simple timers work:

    var timeout = gameTimers.setTimeout(someCallback, 1000),
        interval = gameTimers.setInterval(someRepeatingCallback, 100);

    // After some time:
    interval.clear();

That's how they work, too:

    var bomb = gameTimers.setTimeout(bombExplosion, 5000);

    someButton.on('click', function () {
        if (bomb.getTimeLeft() > 1000) {
            bomb.pause();
        } else {
            console.log('Too late!');
        }
    });

Now, the coolness begins:

    function Unit() {
        this.id = 'u' + getUniqueId();
        gameTimers.setInterval(this.id + 'shoot', this.shoot.bind(this), 500);
    }

    Unit.prototype.shoot = function () {
        // Makes a shot every 500 ms.
    };

    Unit.prototype.kill = function () {
        gameTimers.clearInterval(this.id + 'shoot');
    };

More than that, if your game has levels, you don't have to clear all timers by hand:

    gameTimers.clearAll(); // It will clear both timeouts and intervals.
    currentLevel = new Level();

If there are, say, locations in your game, and you want to freeze their states, you're welcome:

    gameTimers.pauseAll();
    // Player is in different location.
    gameTimers.resumeAll();

There are two ways to interact with a timer:

    var interval = gameTimers.setInterval(callback, 50);

    // Directly invoke its methods:
    interval.pause();
    interval.resume();

    // Or, manipulate them by ID:
    gameTimers.pauseInterval(interval.id);
    gameTimers.clearInterval(interval.id);

The second way may seem a bit strange, but it is very useful, indeed:

    var interval = gameTimers.setInterval('someId', ohThatCallbackAgain, 200);

    // And you can reach your interval from the farthest corner of your code:
    gameTimers.pauseInterval('someId');

In the standard, there is an opportunity to pass optional arguments in the native method: `setTimeout(callback, delay, optArg1, optArg2)`. The syntax in timestore is different but powerful. There are two ways to pass optional arguments:

    var timeout = gameTimers.setTimeout(callback, 50);
    timeout.callWith(arg1, arg2, arg3); // You can choose between this...
    timeout.applyWith([arg1, arg2, arg3]); // ...and this.

And there's the third one which allows to set `this` context for the callback:

    var timeout = gameTimers.setTimeout(someObj.someMethod, 50);
    timeout.setThis(someObj);

All three methods work for intervals, too.

You also can use chaining for more natural code:

    var interval = gameTimers.setInterval(callback, 50).callWith('give', 'drain').setThis(someObject);
    interval.applyWith(['drain', 'gain']); // You can always rewrite optional arguments.

Timeouts and intervals are stored aside from each other so the same IDs can be used for two of them. Though I don't recommend to do so due to the bad readability of the code with somehow doubling IDs.

**NOTE**: *do not use numbers (and strings with just numbers in them, too) as IDs* because numbers are used as the inner standard for IDs.

## API

### Class: Timeout

Syntax: `new Timeout(callback, delay, [fireBeforeClear], [id], [onClear])`. The last 2 arguments are used internally but will cause no harm if are passed.

* *function* `callback` is just a callback, like in the native `setTimeout`
* *number* `delay` is simply a number of milliseconds before the callback invocation
* *boolean* `fireBeforeClear` forces the callback to be invoked if the timeout is explicitly cleared
* *string* `id` is used by Timestore class to know all timeouts by "name"
* *function* `onClear` is called when a timeout ends or is explicitly cleared (it is used to remove timeouts from the store)

All methods return `this` and therefore **can be chained** (except for `.clear()` and those which return exact values, like `.getTimeLeft()`).

#### Timeout.setThis(thisArg)

Sets `this` context for `callback`.

#### Timeout.callWith(arg1, arg2, ...)

Saves arguments to pass them into `callback` while it's invoked. Rewrites old arguments if they exist.

#### Timeout.applyWith(args)

Saves `args` as arguments to pass them into `callback` while it's invoked. Rewrites old arguments if they exist.

#### Timeout.clear()

Simply clears the timeout. If `Timeout.fireBeforeClear` is set to `true` its callback will be invoked.

#### Timeout.pause()

Pauses the timeout, causes no side effects.

#### Timeout.resume()

Resumes the timeout. If `Timeout.delay` has been changed so to match a point in the past, the callback will be invoked immediately.

#### Timeout.toggle()

Pauses or resumes the timeout depending on its current state.

#### Timeout.changeDelay(newDelay)

Changes `Timeout.delay`. If it's changed so to match a point in the past, the callback will be invoked immediately.

#### Timeout.getTimeLeft()

Returns the time left to the callback invocation.

### Class: Interval

Syntax: `new Interval(callback, delay, [fireBeforeClear], [id], [onClear])`. The last 2 arguments are used internally but will cause no harm if are passed.

* *function* `callback` is just a callback, like in the native `setInterval`; it will be called every `delay` milliseconds
* *number* `delay` is simply a number of milliseconds before the next callback invocation
* *boolean* `fireBeforeClear` forces the callback to be called if an interval is explicitly cleared
* *string* `id` is used by Timestore class to know all intervals by "name"
* *function* `onClear` is called when an interval is explicitly cleared (it is used to remove intervals from the store)

All methods return `this` and therefore **can be chained** (except for `.clear()` and those which return exact values, like `.getTimeLeft()`).

#### Interval.setThis(thisArg)

Sets `this` context for `callback`.

#### Interval.callWith(arg1, arg2, ...)

Saves arguments to pass them into `callback` while it's invoked (every time). Rewrites old arguments if they exist.

#### Interval.applyWith(args)

Saves `args` as arguments to pass them into `callback` while it's invoked (every time). Rewrites old arguments if they exist.

#### Interval.clear()

Clears the interval. If `Interval.fireBeforeClear` is set to `true` its callback will be invoked (for the last time).

#### Interval.pause()

Pauses the interval without side effects.

#### Interval.resume()

Resumes the interval. If `Interval.delay` has been changed so to match a point in the past, the callback will be invoked immediately.

#### Interval.toggle()

Pauses or resumes the interval depending on its current state.

#### Interval.changeDelay(newDelay)

Changes `Interval.delay`. If it's changed so to match a point in the past, the callback will be invoked immediately. That change affects all callback invocations, not only the current one.

#### Interval.getTimeLeft()

Returns the time left to the next callback invocation.

### Class: Timestore

Syntax: `new Timestore()`.

#### Timestore.setTimeout([id], callback, delay, fireBeforeClear)

Returns a `Timeout` object.

* *string* `id` is optional; if there is already a timeout with the same ID, it will be cleared and overwritten

**NOTE**: don't use numbers as IDs.

#### Timestore.clearTimeout(id), Timestore.pauseTimeout(id), Timestore.resumeTimeout(id), Timestore.resumeTimeout(id), Timestore.changeTimeoutDelay(id, newDelay), Timestore.getTimeoutTimeLeft(id)

If there is a timeout with a given `id`, calls the corresponding method of that timeout. Passes the arguments, if any. Returns the return value of that method, if any.

#### Timestore.clearTimeouts(idArray), Timestore.pauseTimeouts(idArray), Timestore.resumeTimeouts(idArray), Timestore.resumeTimeouts(idArray)

Calls the corresponding method of all the timeouts which IDs are listed in `idArray`.

#### Timestore.setInterval([id], callback, delay, fireBeforeClear)

Returns a `Interval` object.

* *string* `id` is optional; if there is already an interval with the same ID, it will be cleared and overwritten

**NOTE**: don't use numbers as IDs.

#### Timestore.clearInterval(id), Timestore.pauseInterval(id), Timestore.resumeInterval(id), Timestore.resumeInterval(id), Timestore.changeIntervalDelay(id, newDelay), Timestore.getIntervalTimeLeft(id)

If there is an interval with a given `id`, calls the corresponding method of that interval. Passes the arguments, if any. Returns the return value of that method, if any.

#### Timestore.clearIntervals(idArray), Timestore.pauseIntervals(idArray), Timestore.resumeIntervals(idArray), Timestore.resumeIntervals(idArray)

Calls the corresponding method of all the intervals which IDs are listed in `idArray`.

#### Timestore.clearAll()

Clears all timeouts and intervals. Resets inner ID counters to zero. Empties the current timestore. All timeouts and intervals with `fireBeforeClear` invoke their callbacks.

#### Timestore.pauseAll()

Pauses all timeouts and intervals without side effects.

#### Timestore.resumeAll()

Resumes all timeouts and intervals. For those which `Interval.delay` has been changed so to match a point in the past, the callbacks will be invoked immediately.

#### Timestore.getTimeouts()

Returns an array of timeout IDs.

#### Timestore.hasTimeout(id)

Returns `true` if there is a timeout with a given `id`. Otherwise, returns `false`.

#### Timestore.getIntervals()

Returns an array of interval IDs.

#### Timestore.hasInterval(id)

Returns `true` if there is an interval with a given `id`. Otherwise, returns `false`.