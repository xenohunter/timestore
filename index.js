"use strict";


/** PLACEHOLDER FOR onClear() FUNCTION AND Timeout.prototype.log() METHOD */

function none() {}


/** TIMEOUT */

function Timeout(callback, delay, fireBeforeClear, id, onClear) {

    var self = this;

    this.callback = callback;
    this.delay = delay;
    this.fireBeforeClear = fireBeforeClear;

    this.id = id || null;
    this.onClear = onClear || none;

    this.thisArg = null;
    this.withArgs = [];

    this.nativeTimeoutId = setTimeout(function () {
        self.callback.apply(self.thisArg, self.withArgs);
        self.onClear();
        self.burnt = true;
        self.log('execute');
    }, this.delay);

    this.isPaused = false;
    this.pausedAt = 0;
    this.resumedAt = Date.now();

    this.cumulativeWork = 0;

    this.burnt = false;

    this.log('create');

}

Timeout.prototype.setThis = function (thisArg) {
    this.thisArg = thisArg || null;
    return this;
};

Timeout.prototype.callWith = function () {
    this.withArgs = Array.prototype.slice.call(arguments);
    return this;
};

Timeout.prototype.applyWith = function (args) {
    this.withArgs = args || [];
    return this;
};

Timeout.prototype.clear = function () {

    if (this.burnt) return;

    if (this.fireBeforeClear && this.isPaused === false) {
        this.callback.apply(this.thisArg, this.withArgs);
    }

    clearTimeout(this.nativeTimeoutId);
    this.onClear();
    this.burnt = true;

    this.log('clear');

};

Timeout.prototype.pause = function () {

    if (this.isPaused === true || this.burnt) return;

    clearTimeout(this.nativeTimeoutId);

    this.isPaused = true;
    this.pausedAt = Date.now();

    this.log('pause');

    return this;

};

Timeout.prototype.resume = function () {

    var self = this,
        lastWork;

    if (this.isPaused === false || this.burnt) return;

    lastWork = this.pausedAt - this.resumedAt;

    this.delay -= lastWork;
    if (this.delay < 0) {
        this.delay = 0;
    }

    this.nativeTimeoutId = setTimeout(function () {
        self.callback.apply(self.thisArg, self.withArgs);
        self.onClear();
        self.burnt = true;
        self.log('execute');
    }, this.delay);

    this.isPaused = false;
    this.resumedAt = Date.now();

    this.cumulativeWork += lastWork;

    this.log('resume');

    return this;

};

Timeout.prototype.toggle = function () {

    if (this.isPaused) {
        this.resume();
    } else {
        this.pause();
    }

    return this;

};

Timeout.prototype.changeDelay = function (newDelay) {

    var hasBeenPaused = this.isPaused;

    !hasBeenPaused && this.pause();
    this.delay = newDelay - this.cumulativeWork;
    !hasBeenPaused && this.resume();

    return this;

};

Timeout.prototype.getTimeLeft = function () {
    if (this.burnt) {
        return 0;
    } else if (this.isPaused) {
        return this.delay - (this.pausedAt - this.resumedAt);
    } else {
        return this.delay - (Date.now() - this.resumedAt);
    }
};

Timeout.prototype.log = none;


/** INTERVAL */

function Interval(callback, delay, fireBeforeClear, id, onClear) {

    var self = this;

    this.callback = callback;
    this.delay = delay;
    this.fireBeforeClear = fireBeforeClear;

    this.id = id || null;
    this.onClear = onClear || none;

    this.thisArg = null;
    this.withArgs = [];

    this.run = function () {
        self.timeout = new Timeout(self.run.bind(self), self.delay);
        self.callback.apply(self.thisArg, self.withArgs);
    };

    this.timeout = new Timeout(this.run.bind(this), this.delay);

}

Interval.prototype.setThis = function (thisArg) {
    this.thisArg = thisArg || null;
    return this;
};

Interval.prototype.callWith = function () {
    this.withArgs = Array.prototype.slice.call(arguments);
    return this;
};

Interval.prototype.applyWith = function (args) {
    this.withArgs = args || [];
    return this;
};

Interval.prototype.clear = function () {

    // To avoid a leak from `this.run` which is an actual callback passed to `this.timeout`.
    if (this.fireBeforeClear && this.timeout.isPaused === false) {
        this.callback.apply(this.thisArg, this.withArgs);
    }

    this.timeout.clear();
    this.onClear();

};

Interval.prototype.pause = function () {
    this.timeout.pause();
    return this;
};

Interval.prototype.resume = function () {
    this.timeout.resume();
    return this;
};

Interval.prototype.toggle = function () {
    this.timeout.toggle();
    return this;
};

Interval.prototype.changeDelay = function (newDelay) {
    this.delay = newDelay;
    this.timeout.changeDelay(this.delay);
    return this;
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

Timestore.prototype.clearTimeouts = function (idArray) {
    idArray.forEach(function (id) {
        id in this.timeouts && this.timeouts[id].clear();
    }, this);
};

Timestore.prototype.pauseTimeout = function (id) {
    id in this.timeouts && this.timeouts[id].pause();
};

Timestore.prototype.pauseTimeouts = function (idArray) {
    idArray.forEach(function (id) {
        id in this.timeouts && this.timeouts[id].pause();
    }, this);
};

Timestore.prototype.resumeTimeout = function (id) {
    id in this.timeouts && this.timeouts[id].resume();
};

Timestore.prototype.resumeTimeouts = function (idArray) {
    idArray.forEach(function (id) {
        id in this.timeouts && this.timeouts[id].resume();
    }, this);
};

Timestore.prototype.toggleTimeout = function (id) {
    id in this.timeouts && this.timeouts[id].toggle();
};

Timestore.prototype.toggleTimeouts = function (idArray) {
    idArray.forEach(function (id) {
        id in this.timeouts && this.timeouts[id].toggle();
    }, this);
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

Timestore.prototype.clearIntervals = function (idArray) {
    idArray.forEach(function (id) {
        id in this.intervals && this.intervals[id].clear();
    }, this);
};

Timestore.prototype.pauseInterval = function (id) {
    id in this.intervals && this.intervals[id].pause();
};

Timestore.prototype.pauseIntervals = function (idArray) {
    idArray.forEach(function (id) {
        id in this.intervals && this.intervals[id].pause();
    }, this);
};

Timestore.prototype.resumeInterval = function (id) {
    id in this.intervals && this.intervals[id].resume();
};

Timestore.prototype.resumeIntervals = function (idArray) {
    idArray.forEach(function (id) {
        id in this.intervals && this.intervals[id].resume();
    }, this);
};

Timestore.prototype.toggleInterval = function (id) {
    id in this.intervals && this.intervals[id].toggle();
};

Timestore.prototype.toggleIntervals = function (idArray) {
    idArray.forEach(function (id) {
        id in this.intervals && this.intervals[id].toggle();
    }, this);
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


/** EXPORTING */

module.exports = {
    Timeout: Timeout,
    Interval: Interval,
    Timestore: Timestore
};