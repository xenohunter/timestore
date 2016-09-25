# Timestore [![npm version](https://badge.fury.io/js/timestore.svg)](https://badge.fury.io/js/timestore)

Manage multiple collections of timers: set, clear, pause and resume them.
Use them with your [game states](http://phaser.io/news/2015/06/using-states-tutorial), for example.

### Installation

    $ npm install timestore

### Usage

    var Timestore = isNode ? require('timestore') : timestore,
        timers = new Timestore();

    var timerId = timers.setTimeout(function () {
        console.log('Boo!');
    }, 5000);

    someBtn.onclick = function () {
        timers.toggleTimeout(timerId);
    };