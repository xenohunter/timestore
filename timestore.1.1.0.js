(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.timestore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";


/** PLACEHOLDER FOR onClear() FUNCTION */

function none() {}


/** TIMEOUT */

function Timeout(callback, delay, fireBeforeClear, id, onClear) {

    var self = this;

    this.callback = callback;
    this.delay = delay;
    this.fireBeforeClear = fireBeforeClear;

    this.id = id || null;
    this.onClear = onClear || none;
    this.onReject = none;

    this.nativeTimeoutId = setTimeout(function () {
        self.callback();
        self.onClear();
        self.burnt = true;
    }, this.delay);

    this.timestamp = Date.now();

    this.isPaused = false;
    this.pausedAt = 0;

    this.burnt = false;

}

Timeout.prototype.clear = function () {

    if (this.burnt) return;

    if (this.fireBeforeClear && this.isPaused === false) {
        this.callback();
    }

    clearTimeout(this.nativeTimeoutId);
    this.onClear();
    this.onReject("Timeout is canceled");
    this.burnt = true;

};

Timeout.prototype.pause = function () {

    if (this.isPaused === true || this.burnt) return;

    clearTimeout(this.nativeTimeoutId);

    this.isPaused = true;
    this.pausedAt = Date.now();

};

Timeout.prototype.resume = function () {

    var self = this;

    if (this.isPaused === false || this.burnt) return;

    this.delay = this.delay - (this.pausedAt - this.timestamp);
    if (this.delay < 0) this.delay = 0;

    this.timestamp = Date.now();

    this.nativeTimeoutId = setTimeout(function () {
        self.callback();
        self.onClear();
        self.burnt = true;
    }, this.delay);

    this.isPaused = false;
    this.pausedAt = 0;

};

Timeout.prototype.toggle = function () {
    if (this.isPaused) {
        this.resume();
    } else {
        this.pause();
    }
};

Timeout.prototype.changeDelay = function (newDelay) {

    var hasBeenPaused = this.isPaused;

    !hasBeenPaused && this.pause();
    this.delay = newDelay;
    !hasBeenPaused && this.resume();

};

Timeout.prototype.getTimeLeft = function () {
    if (this.burnt) {
        return 0;
    } else if (this.isPaused) {
        return this.delay - (this.pausedAt - this.timestamp);
    } else {
        return this.delay - (Date.now() - this.timestamp);
    }
};


/** INTERVAL */

function Interval(callback, delay, fireBeforeClear, id, onClear) {

    var self = this;

    this.callback = callback;
    this.delay = delay;
    this.fireBeforeClear = fireBeforeClear;

    this.id = id || null;
    this.onClear = onClear || none;

    this.run = function () {
        self.timeout = new Timeout(self.run.bind(self), self.delay);
        self.callback();
    };

    this.timeout = new Timeout(this.run.bind(this), this.delay);

}

Interval.prototype.clear = function () {

    // To avoid a leak from `this.run` which is an actual callback passed to `this.timeout`.
    if (this.fireBeforeClear && this.timeout.isPaused === false) {
        this.callback();
    }

    this.timeout.clear();
    this.onClear();

};

Interval.prototype.pause = function () {
    this.timeout.pause();
};

Interval.prototype.resume = function () {
    this.timeout.resume();
};

Interval.prototype.toggle = function () {
    this.timeout.toggle();
};

Interval.prototype.changeDelay = function (newDelay) {
    this.delay = newDelay;
    this.timeout.changeDelay(this.delay);
};

Interval.prototype.getTimeLeft = function () {
    return this.timeout.getTimeLeft();
};


/** TIMESTORE */

function Timestore() {

    this.timeouts = {};
    this.uniqueTimeoutId = 0;

    this.intervals = {};
    this.uniqueIntervalId = 0;

}


/** WRAPPERS FOR TIMEOUTS */

Timestore.prototype.setTimeout = function (id, callback, delay, fireBeforeClear) {

    var self = this;

    if (typeof id === 'function') {
        fireBeforeClear = delay;
        delay = callback;
        callback = id;
        id = this.uniqueTimeoutId++;
    } else {
        id = id || this.uniqueTimeoutId++;
    }

    id = id.toString();
    if (id in this.timeouts) this.clearTimeout(id);

    this.timeouts[id] = new Timeout(callback, delay, fireBeforeClear, id, function () {
        delete self.timeouts[id];
    });

    return this.timeouts[id];

};

Timestore.prototype.clearTimeout = function (id) {
    id in this.timeouts && this.timeouts[id].clear();
};

Timestore.prototype.pauseTimeout = function (id) {
    id in this.timeouts && this.timeouts[id].pause();
};

Timestore.prototype.resumeTimeout = function (id) {
    id in this.timeouts && this.timeouts[id].resume();
};

Timestore.prototype.toggleTimeout = function (id) {
    id in this.timeouts && this.timeouts[id].toggle();
};

Timestore.prototype.changeTimeoutDelay = function (id, newDelay) {
    id in this.timeouts && this.timeouts[id].changeDelay(newDelay);
};

Timestore.prototype.getTimeoutTimeLeft = function (id) {
    if (id in this.timeouts) {
        return this.timeouts[id].getTimeLeft();
    } else {
        return 0;
    }
};


/** WRAPPERS FOR INTERVALS */

Timestore.prototype.setInterval = function (id, callback, delay, fireBeforeClear) {

    var self = this;

    if (typeof id === 'function') {
        fireBeforeClear = delay;
        delay = callback;
        callback = id;
        id = this.uniqueIntervalId++;
    } else {
        id = id || this.uniqueIntervalId++;
    }

    id = id.toString();
    if (id in this.intervals) this.clearInterval(id);

    this.intervals[id] = new Interval(callback, delay, fireBeforeClear, id, function () {
        delete self.intervals[id];
    });

    return this.intervals[id];

};

Timestore.prototype.clearInterval = function (id) {
    id in this.intervals && this.intervals[id].clear();
};

Timestore.prototype.pauseInterval = function (id) {
    id in this.intervals && this.intervals[id].pause();
};

Timestore.prototype.resumeInterval = function (id) {
    id in this.intervals && this.intervals[id].resume();
};

Timestore.prototype.toggleInterval = function (id) {
    id in this.intervals && this.intervals[id].toggle();
};

Timestore.prototype.changeIntervalDelay = function (id, newDelay) {
    id in this.intervals && this.intervals[id].changeDelay(newDelay);
};

Timestore.prototype.getIntervalTimeLeft = function (id) {
    if (id in this.intervals) {
        return this.intervals[id].getTimeLeft();
    } else {
        return 0;
    }
};


/** MASSIVE METHODS */

Timestore.prototype.clearAll = function () {

    Object.keys(this.timeouts).forEach(this.clearTimeout.bind(this));
    this.uniqueTimeoutId = 0;

    Object.keys(this.intervals).forEach(this.clearInterval.bind(this));
    this.uniqueIntervalId = 0;

};

Timestore.prototype.pauseAll = function () {

    Object.keys(this.timeouts).forEach(this.pauseTimeout.bind(this));
    Object.keys(this.intervals).forEach(this.pauseInterval.bind(this));

};

Timestore.prototype.resumeAll = function () {

    Object.keys(this.timeouts).forEach(this.resumeTimeout.bind(this));
    Object.keys(this.intervals).forEach(this.resumeInterval.bind(this));

};


/** TOOLS */

Timestore.prototype.getTimeouts = function () {
    return Object.keys(this.timeouts);
};

Timestore.prototype.hasTimeout = function (id) {
    return (id in this.timeouts);
};

Timestore.prototype.getIntervals = function () {
    return Object.keys(this.intervals);
};

Timestore.prototype.hasInterval = function (id) {
    return (id in this.intervals);
};

/** Promise API **/
Timestore.prototype.delay = function (delay) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.setTimeout(resolve, delay).onReject = reject;
    })
}

/** EXPORTING */

module.exports = {
    Timeout: Timeout,
    Interval: Interval,
    Timestore: Timestore
};
},{}]},{},[1])(1)
});