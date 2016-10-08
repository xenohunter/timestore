var isNode = (typeof window !== 'object'),

    assert = isNode ? require('chai').assert : chai.assert,
    tsModule = isNode ? require('../index') : timestore,

    Timeout = tsModule.Timeout,
    Interval = tsModule.Interval,
    Timestore = tsModule.Timestore,

    ts = new Timestore(),

    sets = [
        { customId: undefined },
        { customId: 'customId' }
    ],

    IDs = ['qwe', 'wer', 'ert', 'rty'],

    details = function (set) {
        var str = '';
        str += set.customId ? ' (custom ID)' : '';
        return str;
    },

    debug = false;


if (debug) {
    (function () {
		var testsRunAt = Date.now();
		Timeout.prototype.log = function (action) {
			console.log(action,
                        Date.now() - testsRunAt,
                        this.timestamp - testsRunAt,
                        this.isPaused && this.pausedAt - testsRunAt);
		};
	})();
}


describe('First, there:', function () {

    it('should be Timeout constructor', function () {
        assert.isFunction(Timeout);
    });

    it('should be Interval constructor', function () {
        assert.isFunction(Interval);
    });

    it('should be Timestore constructor', function () {
        assert.isFunction(Timestore);
    });

});


describe('While using timeouts, they:', function () {

    sets.forEach(function (set) {

        it('should fire the callback' + details(set), function (done) {
            ts.setTimeout(set.customId, done, 20);
        });

        it('should not fire the callback if cleared' + details(set), function (done) {

            var didFire = false,
                timeout = ts.setTimeout(set.customId, function () {
                    didFire = true;
                }, 20);

            timeout.clear();

            setTimeout(function () {
                done(didFire);
            }, 40);

        });

        it('should fire with fireBeforeClear flag' + details(set), function (done) {
            var timeout = ts.setTimeout(set.customId, done, 20, true);
            timeout.clear();
        });

        it('should not fire if paused' + details(set), function (done) {

            var didFire = false,
                timeout = ts.setTimeout(set.customId, function () {
                    didFire = true;
                }, 20);

            timeout.pause();

            setTimeout(function () {
                timeout.clear();
                done(didFire);
            }, 40);

        });

        it('should fire and skip duration between pause and resume' + details(set), function (done) {

            var created = Date.now(),
                timeout = ts.setTimeout(set.customId, function () {
                    var distance = Date.now() - created;
                    if (distance > 55 && distance < 65) {
                        done();
                    }
                }, 40);

            setTimeout(function () {
                timeout.pause();
            }, 20);

            setTimeout(function () {
                timeout.resume();
            }, 40);

        });

        it('should be paused, delay-changed, resumed and fire in the time calculated from the initial timestamp' + details(set), function (done) {

            var created = Date.now(),
                mustFireIn = 120, // beforePause + pause + [90-60=30] + afterPause
                timeout = ts.setTimeout(set.customId, function () {
                    var distance = Date.now() - created;
                    if (distance > mustFireIn - 5 && distance < mustFireIn + 5) {
                        done();
                    }
                }, 60);

            setTimeout(function () {
                timeout.pause();
                timeout.changeDelay(90);
            }, 30);

            setTimeout(function () {
                timeout.resume();
            }, 60);

        });

        it('should be [paused, delay-changed, resumed]x2 and fire in the time calculated from the initial timestamp' + details(set), function (done) {

            var created = Date.now(),
                mustFireIn = 210, // beforePause1 + pause1 + [120-90=30] + betweenPauses + pause2 + [150-120=30] + afterPause2
                timeout = ts.setTimeout(set.customId, function () {
                    var distance = Date.now() - created;
                    if (distance > mustFireIn - 5 && distance < mustFireIn + 5) {
                        done();
                    }
                }, 90);

            setTimeout(function () {
                timeout.pause();
                timeout.changeDelay(120);
            }, 30);

            setTimeout(function () {
                timeout.resume();
            }, 60);

            setTimeout(function () {
                timeout.pause();
                timeout.changeDelay(150);
            }, 90);

            setTimeout(function () {
                timeout.resume();
            }, 120);

        });

        it('should be [paused, delay-changed, resumed]x3 and fire in the time calculated from the initial timestamp' + details(set), function (done) {

            var created = Date.now(),
                mustFireIn = 270, // beforePause1 + pause1 + [120-90=30] + betweenPauses + pause2 + [150-120=30] + afterPause2
                timeout = ts.setTimeout(set.customId, function () {
                    var distance = Date.now() - created;
                    if (distance > mustFireIn - 5 && distance < mustFireIn + 5) {
                        done();
                    }
                }, 90);

            setTimeout(function () {
                timeout.pause();
                timeout.changeDelay(120);
            }, 30);

            setTimeout(function () {
                timeout.resume();
            }, 60);

            setTimeout(function () {
                timeout.pause();
                timeout.changeDelay(150);
            }, 90);

            setTimeout(function () {
                timeout.resume();
            }, 120);

            setTimeout(function () {
                timeout.pause();
                timeout.changeDelay(180);
            }, 150);

            setTimeout(function () {
                timeout.resume();
            }, 180);

        });

        it('should be paused, resumed, delay-changed and fire in the time calculated from the initial timestamp' + details(set), function (done) {

            var created = Date.now(),
                mustFireIn = 120, // beforePause + pause + [90-60=30] + afterPause
                timeout = ts.setTimeout(set.customId, function () {
                    var distance = Date.now() - created;
                    if (distance > mustFireIn - 5 && distance < mustFireIn + 5) {
                        done();
                    }
                }, 60);

            setTimeout(function () {
                timeout.pause();
            }, 30);

            setTimeout(function () {
                timeout.resume();
                timeout.changeDelay(90);
            }, 60);

        });

        it('should be [paused, resumed, delay-changed]x2 and fire in the time calculated from the initial timestamp' + details(set), function (done) {

            var created = Date.now(),
                mustFireIn = 210, // beforePause1 + pause1 + [120-90=30] + betweenPauses + pause2 + [150-120=30] + afterPause2
                timeout = ts.setTimeout(set.customId, function () {
                    var distance = Date.now() - created;
                    if (distance > mustFireIn - 5 && distance < mustFireIn + 5) {
                        done();
                    }
                }, 90);

            setTimeout(function () {
                timeout.pause();
            }, 30);

            setTimeout(function () {
                timeout.resume();
                timeout.changeDelay(120);
            }, 60);

            setTimeout(function () {
                timeout.pause();
            }, 90);

            setTimeout(function () {
                timeout.resume();
                timeout.changeDelay(150);
            }, 120);

        });

        it('should be [paused, resumed, delay-changed]x3 and fire in the time calculated from the initial timestamp' + details(set), function (done) {

            var created = Date.now(),
                mustFireIn = 270, // beforePause1 + pause1 + [120-90=30] + betweenPauses + pause2 + [150-120=30] + afterPause2
                timeout = ts.setTimeout(set.customId, function () {
                    var distance = Date.now() - created;
                    if (distance > mustFireIn - 5 && distance < mustFireIn + 5) {
                        done();
                    }
                }, 90);

            setTimeout(function () {
                timeout.pause();
            }, 30);

            setTimeout(function () {
                timeout.resume();
                timeout.changeDelay(120);
            }, 60);

            setTimeout(function () {
                timeout.pause();
            }, 90);

            setTimeout(function () {
                timeout.resume();
                timeout.changeDelay(150);
            }, 120);

            setTimeout(function () {
                timeout.pause();
            }, 150);

            setTimeout(function () {
                timeout.resume();
                timeout.changeDelay(180);
            }, 180);

        });

        it('should return the right estimated time when paused' + details(set), function (done) {

            var timeout = ts.setTimeout(set.customId, function () {}, 1130);

            setTimeout(function () {
                var estimated;
                timeout.pause();
                estimated = timeout.getTimeLeft();
                done((estimated > 1095 && estimated < 1105) ? null : estimated);
            }, 30);

        });

        it('should return the right estimated time when paused and measured later' + details(set), function (done) {

            var timeout = ts.setTimeout(set.customId, function () {}, 1130);

            setTimeout(function () {
                timeout.pause();
            }, 30);

            setTimeout(function () {
                var estimated = timeout.getTimeLeft();
                done((estimated > 1095 && estimated < 1105) ? null : estimated);
            }, 50);

        });

        it('should return the right estimated time when paused and resumed' + details(set), function (done) {

            var timeout = ts.setTimeout(set.customId, function () {}, 1130);

            setTimeout(function () {
                timeout.pause();
            }, 30);

            setTimeout(function () {
                var estimated;
                timeout.resume();
                estimated = timeout.getTimeLeft();
                done((estimated > 1095 && estimated < 1105) ? null : estimated);
            }, 50);

        });

        it('should return the right estimated time when paused, resumed and measured later' + details(set), function (done) {

            var timeout = ts.setTimeout(set.customId, function () {}, 1130);

            setTimeout(function () {
                timeout.pause();
            }, 30);

            setTimeout(function () {
                timeout.resume();
            }, 50);

            setTimeout(function () {
                var estimated = timeout.getTimeLeft();
                done((estimated > 1065 && estimated < 1075) ? null : estimated);
            }, 80);

        });

        it('should return the right estimated time when paused, resumed and paused again' + details(set), function (done) {

            var timeout = ts.setTimeout(set.customId, function () {}, 1130);

            setTimeout(function () {
                timeout.pause();
            }, 30);

            setTimeout(function () {
                timeout.resume();
            }, 50);

            setTimeout(function () {
                var estimated;
                timeout.pause();
                estimated = timeout.getTimeLeft();
                done((estimated > 1065 && estimated < 1075) ? null : estimated);
            }, 80);

        });

        it('should return the right estimated time when paused, resumed, paused again and resumed again' + details(set), function (done) {

            var timeout = ts.setTimeout(set.customId, function () {}, 1130);

            setTimeout(function () {
                timeout.pause();
            }, 30);

            setTimeout(function () {
                timeout.resume();
            }, 50);

            setTimeout(function () {
                timeout.pause();
            }, 80);

            setTimeout(function () {
                var estimated;
                timeout.resume();
                estimated = timeout.getTimeLeft();
                done((estimated > 1065 && estimated < 1075) ? null : estimated);
            }, 110);

        });

    });

    it('should not fire twice if ID was overwritten', function (done) {
        ts.setTimeout('testId', done, 20);
        ts.setTimeout('testId', done, 20);
    });

    it('should fire twice if ID was overwritten over a timeout with fireBeforeClear flag', function (done) {

        var callCounter = 2;

        ts.setTimeout('testId', function () {
            callCounter--;
        }, 20, true);

        ts.setTimeout('testId', function () {
            callCounter--;
        }, 20);

        setTimeout(function () {
            done(callCounter);
        }, 50);

    });

});


describe('While using intervals, they:', function () {

    sets.forEach(function (set) {

        it('should fire thrice, then be cleared' + details(set), function (done) {

            var callCounter = 3,
                interval = ts.setInterval(set.customId, function () {
                    callCounter--;
                }, 20);

            setTimeout(function () {
                interval.clear();
                done(callCounter);
            }, 70);

        });

        it('should fire twice, be paused/resumed, fire twice more, then be cleared' + details(set), function (done) {

            var callCounter = 4,
                interval = ts.setInterval(set.customId, function () {
                    callCounter--;
                }, 20);

            setTimeout(function () {
                interval.pause();
                if (callCounter !== 2) {
                    ts.clearAll();
                    done('too fast');
                }
            }, 50);

            setTimeout(function () {
                interval.resume();
                if (callCounter !== 2) {
                    ts.clearAll();
                    done('has not stopped');
                }
            }, 70);

            setTimeout(function () {
                done(callCounter);
            }, 110);

        });

    });

    it('should fire twice if ID was overwritten', function (done) {

        var callCounter = 2,
            checkFunction = function () {
                callCounter--;
            };

        ts.setInterval('testId', checkFunction, 20);
        ts.setInterval('testId', checkFunction, 20);

        setTimeout(function () {
            ts.clearAll();
            done(callCounter);
        }, 50);

    });

    it('should fire thrice if ID was overwritten over a timeout with fireBeforeClear flag', function (done) {

        var callCounter = 3,
            checkFunction = function () {
                callCounter--;
            };

        ts.setInterval('testId', checkFunction, 20, true);
        ts.setInterval('testId', checkFunction, 20);

        setTimeout(function () {
            ts.clearAll();
            done(callCounter);
        }, 50);

    });

});


describe('While changing timeout delay, it:', function () {

    sets.forEach(function (set) {

        it('should postpone the fire if delay was increased' + details(set), function (done) {

            var created = Date.now(),
                timeout = ts.setTimeout(set.customId, function () {
                    var distance = Date.now() - created;
                    if (distance > 55 && distance < 65) {
                        done();
                    }
                }, 40);

            setTimeout(function () {
                timeout.changeDelay(60);
            }, 20);

        });

        it('should fire now if delay was changed so to fire in the past' + details(set), function (done) {

            var created = Date.now(),
                timeout = ts.setTimeout(set.customId, function () {
                    var distance = Date.now() - created;
                    if (distance < 46) { // 30 + 16 (lag for setTimeout)
                        done();
                    }
                }, 60);

            setTimeout(function () {
                timeout.changeDelay(20);
            }, 30);

        });

        it('should return the right estimated time when paused and delay-changed' + details(set), function (done) {

            var timeout = ts.setTimeout(function () {}, 1000);

            setTimeout(function () {
                var estimated;
                timeout.pause();
                timeout.changeDelay(1200);
                estimated = timeout.getTimeLeft();
                done((estimated > 995 && estimated < 1005) ? null : estimated);
            }, 200);

        });

        it('should return the right estimated time when paused, resumed and delay-changed' + details(set), function (done) {

            var timeout = ts.setTimeout(function () {}, 1000);

            setTimeout(function () {
                timeout.pause();
            }, 200);

            setTimeout(function () {
                var estimated;
                timeout.resume();
                timeout.changeDelay(1200);
                estimated = timeout.getTimeLeft();
                done((estimated > 995 && estimated < 1005) ? null : estimated);
            }, 300);

        });

        it('should return the right estimated time when paused, delay-changed and resumed' + details(set), function (done) {

            var timeout = ts.setTimeout(function () {}, 1000);

            setTimeout(function () {
                timeout.pause();
                timeout.changeDelay(1200);
            }, 200);

            setTimeout(function () {
                var estimated;
                timeout.resume();
                estimated = timeout.getTimeLeft();
                done((estimated > 995 && estimated < 1005) ? null : estimated);
            }, 300);

        });

    });

});


describe('While using massive methods, they:', function () {

    it('should clear all timeouts and intervals', function (done) {

        Timeout.prototype.log = function () {}; // This test will fail if debug log is enabled.

        var didFire = false,
            defaultCount = 5,
            checkFunction = function () {
                didFire = true;
            };

        while (defaultCount--) {
            ts.setTimeout(checkFunction, 20);
            ts.setInterval(checkFunction, 20);
        }

        IDs.forEach(function (id) {
            ts.setTimeout(id, checkFunction, 20);
            ts.setInterval(id, checkFunction, 20);
        });

        ts.clearAll();

        setTimeout(function () {
            done(didFire);
        }, 40);

    });

    it('should create a timeout with ID = 0 and an interval with ID = 0 after clearing all', function () {

        Timeout.prototype.log = function () {}; // This test will fail if debug log is enabled.

        var defaultTimersCount = 5,
            timeoutToCheck,
            intervalToCheck;

        while (defaultTimersCount--) {
            ts.setTimeout(function () {}, 1000);
            ts.setInterval(function () {}, 1000);
        }

        ts.clearAll();

        timeoutToCheck = ts.setTimeout(function () {}, 1000);
        intervalToCheck = ts.setInterval(function () {}, 1000);

        assert.equal(timeoutToCheck.id, 0);
        assert.equal(intervalToCheck.id, 0);

        ts.clearAll();

    });

    it('should pause all timeouts and intervals', function (done) {

        Timeout.prototype.log = function () {}; // This test will fail if debug log is enabled.

        var didFire = false,
            defaultTimersCount = 5,
            checkFunction = function () {
                didFire = true;
            };

        while (defaultTimersCount--) {
            ts.setTimeout(checkFunction, 20);
            ts.setInterval(checkFunction, 20);
        }

        IDs.forEach(function (id) {
            ts.setTimeout(id, checkFunction, 20);
            ts.setInterval(id, checkFunction, 20);
        });

        ts.pauseAll();

        setTimeout(function () {
            ts.clearAll();
            done(didFire);
        }, 40);

    });

    it('should resume all timeouts and intervals', function (done) {

        Timeout.prototype.log = function () {}; // This test will fail if debug log is enabled.

        var defaultCount = 5,
            mustFire = (IDs.length + defaultCount) * 2,
            didFire = 0,

            checkFunction = function () {
                didFire++;
            };

        while (defaultCount--) {
            ts.setTimeout(checkFunction, 20);
            ts.setInterval(checkFunction, 20);
        }

        IDs.forEach(function (id) {
            ts.setTimeout(id, checkFunction, 20);
            ts.setInterval(id, checkFunction, 20);
        });

        ts.pauseAll();

        setTimeout(function () {
            ts.resumeAll();
        }, 20);

        setTimeout(function () {
            ts.clearAll();
            done(didFire >= mustFire ? null : 'too few calls');
        }, 60);

    });

    it('should fire timeouts/intervals and skip duration between pause and resume', function (done) {

        Timeout.prototype.log = function () {}; // This test will fail if debug log is enabled.

        var created = Date.now(),
            callCount = 2,

            checkFunction = function () {
                var distance = Date.now() - created;
                if (distance > 55 && distance < 65) {
                    callCount--;
                }
            };

        ts.setTimeout(checkFunction, 40);
        ts.setInterval(checkFunction, 40);

        setTimeout(function () {
            ts.pauseAll();
        }, 20);

        setTimeout(function () {
            ts.resumeAll();
        }, 40);

        setTimeout(function () {
            ts.clearAll();
            done(callCount);
        }, 70);

    });

    it('should affect timeouts selectively by IDs', function (done) {

        var IDs = ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // Only 'f' and 'g' must fire.
            callCount = 2,
            checkFunction = function () {
                callCount--;
            };

        IDs.forEach(function (id) {
            ts.setTimeout(id, checkFunction, 20);
        });

        ts.toggleTimeouts(['f', 'g']);
        ts.toggleTimeouts(['f', 'g']);
        ts.pauseTimeouts(['f', 'g']);
        ts.resumeTimeouts(['f', 'g']);

        ts.clearTimeouts(['a', 'b', 'c', 'd', 'e']);

        setTimeout(function () {
            done(callCount);
        }, 40);

    });

    it('should affect intervals selectively by IDs', function (done) {

        var IDs = ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // Only 'f' and 'g' must fire.
            callCount = 2,
            checkFunction = function () {
                callCount--;
            };

        IDs.forEach(function (id) {
            ts.setInterval(id, checkFunction, 30);
        });

        ts.toggleIntervals(['f', 'g']);
        ts.toggleIntervals(['f', 'g']);
        ts.pauseIntervals(['f', 'g']);
        ts.resumeIntervals(['f', 'g']);

        ts.clearIntervals(['a', 'b', 'c', 'd', 'e']);

        setTimeout(function () {
            done(callCount);
        }, 50);

    });

});


describe('While using additional tools, there:', function () {

    it('should be a list of IDs (getTimeouts)', function () {
        assert.isArray(ts.getTimeouts());
    });

    it('should be a list of IDs (getIntervals)', function () {
        assert.isArray(ts.getIntervals());
    });

    it('should be a returned ID in the list of IDs (getTimeouts)', function () {
        var timeout = ts.setTimeout(function () {}, 1000);
        assert.include(ts.getTimeouts(), timeout.id);
        timeout.clear();
    });


    it('should be a returned ID in the list of IDs (getIntervals)', function () {
        var interval = ts.setInterval(function () {}, 1000);
        assert.include(ts.getIntervals(), interval.id);
        interval.clear();
    });

    it('should be a matching list of custom IDs (getTimeouts)', function () {

        IDs.forEach(function (id) {
            ts.setTimeout(id, function () {}, 1000);
        });

        assert.sameMembers(ts.getTimeouts(), IDs);
        ts.clearAll();

    });

    it('should be a matching list of custom IDs (getIntervals)', function () {

        IDs.forEach(function (id) {
            ts.setInterval(id, function () {}, 1000);
        });

        assert.sameMembers(ts.getIntervals(), IDs);
        ts.clearAll();

    });

    it('should be returned true for a returned ID (hasTimeout)', function () {
        var timeout = ts.setTimeout(function () {}, 1000);
        assert.ok(ts.hasTimeout(timeout.id));
        timeout.clear();
    });

    it('should be returned true for a returned ID (hasInterval)', function () {
        var interval = ts.setInterval(function () {}, 1000);
        assert.ok(ts.hasInterval(interval.id));
        interval.clear();
    });

    it('should be returned true for a custom ID (hasTimeout)', function () {
        var id = 'testId';
        ts.setTimeout(id, function () {}, 1000);
        assert.ok(ts.hasTimeout(id));
        ts.clearTimeout(id);
    });

    it('should be returned true for a custom ID (hasInterval)', function () {
        var id = 'testId';
        ts.setInterval(id, function () {}, 1000);
        assert.ok(ts.hasInterval(id));
        ts.clearInterval(id);
    });

});


describe('While using wrappers, they:', function () {

    it('should pause/resume a timeout (toggle)', function (done) {

        var timeout = ts.setTimeout(done, 20);

        timeout.toggle();
        timeout.toggle();

    });

    it('should pause/resume an interval (toggle)', function (done) {

        var interval = ts.setInterval(function () {
            interval.clear();
            done();
        }, 20);

        interval.toggle();
        interval.toggle();

    });

});


describe('While calling timer methods, all of them must work:', function () {

    it('with a direct call for timeouts', function (done) {

        var timeout = ts.setTimeout(done, 20, true);

        timeout.pause();
        timeout.resume();

        timeout.toggle();
        timeout.toggle();

        timeout.changeDelay(30);
        assert.isNumber(timeout.getTimeLeft());

        timeout.log('');

        timeout.clear();

    });

    it('with a direct call for intervals', function (done) {

        var interval = ts.setInterval(done, 20, true);

        interval.pause();
        interval.resume();

        interval.toggle();
        interval.toggle();

        interval.changeDelay(30);
        assert.isNumber(interval.getTimeLeft());

        interval.clear();

    });

    it('with a call by ID for timeouts', function (done) {

        var timeout = ts.setTimeout(done, 20, true),
            id = timeout.id;

        ts.pauseTimeout(id);
        ts.resumeTimeout(id);

        ts.toggleTimeout(id);
        ts.toggleTimeout(id);

        ts.changeTimeoutDelay(id, 30);
        assert.isNumber(ts.getTimeoutTimeLeft(id));

        ts.clearTimeout(id);

    });

    it('with a call by ID for intervals', function (done) {

        var interval = ts.setInterval(done, 20, true),
            id = interval.id;

        ts.pauseInterval(id);
        ts.resumeInterval(id);

        ts.toggleInterval(id);
        ts.toggleInterval(id);

        ts.changeIntervalDelay(id, 30);
        assert.isNumber(ts.getIntervalTimeLeft(id));

        ts.clearInterval(id);

    });

});