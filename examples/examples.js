loadImages(IMAGES, function (images) {

    $(function () {

        var camera = new Camera(document.getElementById('rockets')),
            TS = new timestore.Timestore(),
            units = [],

            RAFID, // requestAnimationFrame ID

            ms0 = $('#ms_0'),

            startY = 350 - 142,

            oneThirdShift = Math.floor(camera.w / 3),
            twoThirdsShift = oneThirdShift * 2;

        function tick() {

            ms0.text(TS.getTimeoutTimeLeft('0th'));

            camera.clear();
            camera.draw(units);
            units.forEach(function (unit) {
                unit.tick();
            });

            RAFID = window.requestAnimationFrame(tick);

        }

        units.push(new Rocket(100, startY, images[0], function (yellowRocket) {

            var timeout;

            $('#set_timeout_0').on('click', function () {
                timeout = TS.setTimeout('0th', function () {
                    yellowRocket.accelerate();
                }, 2000);
            });

            $('#clear_timeout_0').on('click', function () {
                timeout.clear();
            });

            $('#toggle_timeout_0').on('click', function () {
                timeout && timeout.toggle();
            });

        }));

        units.push(new Rocket(oneThirdShift + 100, startY, images[1], function (pinkRocket) {

            var interval;

            $('#set_interval_1').on('click', function () {
                interval = TS.setInterval('1st', function () {
                    pinkRocket.move();
                }, 50);
            });

            $('#clear_interval_1').on('click', function () {
                interval && interval.clear();
            });

        }));

        units.push(new Rocket(twoThirdsShift - 10, startY, images[2], function (blueRocket) {
        units.push(new Rocket(twoThirdsShift + 100, startY, images[3], function (greenRocket) {
        units.push(new Rocket(twoThirdsShift + 200, startY, images[4], function (redRocket) {

            var newTS = new timestore.Timestore();

            // Intervals with custom IDs will be overwritten.
            $('#set_intervals_2').on('click', function () {

                newTS.setInterval('blue', function () {
                    blueRocket.move(1);
                }, 50);

                newTS.setInterval('green', function () {
                    greenRocket.move(2);
                }, 50);

                newTS.setInterval('red', function () {
                    redRocket.move(2);
                }, 25);

            });

            $('#clear_intervals_2').on('click', function () {
                newTS.clearAll();
            });

            $('#toggle_blue_2').on('click', function () {
                newTS.toggleInterval('blue');
            });

            $('#toggle_green_2').on('click', function () {
                newTS.toggleInterval('green');
            });

            $('#toggle_red_2').on('click', function () {
                newTS.toggleInterval('red');
            });

        }));
        }));
        }));

        RAFID = window.requestAnimationFrame(tick);

    });

});