"use strict";

var IMAGES = [

    // yellow
    'R0lGODlhWgCOAOMIAGZcXF+MoaGhoeOoS4XD4M/Pz+PeS//8AP///////////////////////////////yH5BAEKAAgALAAAAABaAI4AAAT+EMlJq7046827/2AojmRpnqhXFGnrZuv6zm8c07hp23kP7jufcAPkDY+VYhCJVAKZQ2cR6pM+qTjrFDvTXrkt7xaMEn/JJfMYPVKf2T/3G96Rz+lEuxFf1y/5eX43gIGCLIQwhnuISYqDjI2Oh5ATkouQlo+UmTKUEpyTmKChiKOkhKaeqaKrpaaneK+wdLKso4xqB7oHaq5eu7tmvlbAwGLDUsXBXshKysZazUXPy1bSO9TQUqha2dXbfL/evNHhxOO65bHn6Oq07OPucN3o5ODrTvXfa/PJ+vZKAMFrd+9dvn/WzB3UlxCfM4QF+y2s19DgQ4YR2QyMlxHNRm/+FSVepNiRzMdsITX6w+hE4EqSLRWOJBjT4UyUKT2eVCZP5UuQOU3uLNZT59B0RYUeBVjT4kRqzGT+JBrV5lOqScGYgXpM6lSkVZ1u7OUVnhuXsjpZbSWWrchaZW/FBYU2bV24a+XmpTuX091XgAQINiVYQODBowofFkBYMJ3ChRtDRgMZMajKhslglqwYC+bIggAAKPLZMZPSjEOPBoIaCmo/omOvjtF6CGrQdmSL3nHbdI7eqXPr5t3bB3DYw20AN94buWzit5nfdh4beu3fzfXonr1ieY/s2pMrj/79taLdSshj/4zAEfop13FgjqRXwvzyk+lnsnB/fWf9jlzD0J98vmGwnwb/EZiZBpJwkCANDxpoSAcRKmWHJ4WQhaEGAwxAAAEBhCjiiB92uCEHHX444ooBlDjAiRuk+CGIK85IgIkwZiCjijXOiGOOFXTYoQEG2GgkAUQK+SKQEyhJ5JE2Jikkk00OQOSVRSKZJZZSUinBkFx++KSWWP7IpJNcpimlmUCiqSaXSnpZJZhvxinnnFa+aYCdd+KZJp99+gnnlIFagCaghVJwKKGJXqAkm40G+WikMS5JKYeWXqoplREAADs=',

    // pink
    'R0lGODlhWgCOAOMIAGZcXPtL/1+MoaGhoeOoS4XD4M/Pz+PeS////////////////////////////////yH5BAEKAAgALAAAAABaAI4AAAT+EMlJq7046827/2AojmRpnqhnGGnrZuv6zm8c07hp23kP7jufcAPkDY+VYhCJVAKZQ2cR6pM+qTjrFDvTXrkt7xaMEn/JJfMYPVKf2T/3G96Rz+lEuxFf1y/5eX43gIGCLIQwhnuISYqDjI2Oh5ATkouQlo+UmTKUEpyTmKChiKOkhKaeqaKrpaaneK+wdLKso4xqAboBaq5eu7tmvlbAwGLDUsXBXshKysZazUXPy1bSO9TQUqha2dXbfL/evNHhxOO65bHn6Oq07OPucN3o5ODrTvXfa/PJ+vZKAMFrd+9dvn/WzB3UlxCfM4QF+y2s19DgQ4YR2QyMlxHNRm/+FSVepNiRzMdsITX6w+hE4EqSLRWOJBjT4UyUKT2eVCZP5UuQOU3uLNZT59B0RYUeBVjT4kRqzGT+JBrV5lOqScGYgXpM6lSkVZ1u7OUVnhuXsjpZbSWWrchaZW/FBYU2bV24a+XmpTuX091XgAYINiV4QODBowofHkBYMJ3ChRtDRgMZMajKhslglqwYC+bIggAAKPLZMZPSjEOPBoIaCmo/omOvjtF6CGrQdmSL3nHbdI7eqXPr5t3bB3DYw20AN94buWzit5nfdh4beu3fzfXonr1ieY/s2pMrj/79taLdSshj/4zAEfop13FgjqRXwvzyk+lnsnB/fWf9jlzD0J98vmGwnwb/EZiZBpJwkCANDxpoSAcRKmWHJ4WQhaEGBBBQQAEChCjiiB92uCEHHX444ooClEjAiRuk+CGIK85YgIkwZiCjijXOiGOOFXTY4QEH2GhkAUQK+SKQEyhJ5JE2Jikkk00SQOSVRSKZJZZSUinBkFx++KSWWP7IpJNcpimlmUCiqSaXSnpZJZhvxinnnFa+eYCdd+KZJp99+gnnlIFagCaghVJwKKGJXqAkm40G+WikMS5JKYeWXqoplREAADs=',

    // blue
    'R0lGODlhWgCOAOMIACRczWZcXF+MoaGhoeOoS4XD4M/Pz+PeS////////////////////////////////yH5BAEKAAgALAAAAABaAI4AAAT+EMlJq7046827/2AojmRpnqhnGGnrZuv6zm8c07hp23kP7jufcAPkDY+VYhCJVAKZQ2cR6pM+qTjrFDvTXrkt7xaMEn/JJfMYPVKf2T/3G96Rz+lEuxFf1y/5eX43gIGCLIQwhnuISYqDjI2Oh5ATkouQlo+UmTKUEpyTmKChiKOkhKaeqaKrpaaneK+wdLKso4xqALoAaq5eu7tmvlbAwGLDUsXBXshKysZazUXPy1bSO9TQUqha2dXbfL/evNHhxOO65bHn6Oq07OPucN3o5ODrTvXfa/PJ+vZKAMFrd+9dvn/WzB3UlxCfM4QF+y2s19DgQ4YR2QyMlxHNRm/+FSVepNiRzMdsITX6w+hE4EqSLRWOJBjT4UyUKT2eVCZP5UuQOU3uLNZT59B0RYUeBVjT4kRqzGT+JBrV5lOqScGYAcC1K1dhUqd+PRZ2aq+yL924lNXJaiunr9aylVsLLSi6ce1ywvtWZF23t/RmAjSgsKnCAwgbHoVY8YDDhekgRgx5MprJi0FhTkxmc+XGWDZTFhQgQBHRkZmgfkzaNJDVUFb7KU3bdQzYQ1aPtlO79A7dqXMAZ82792/gPobPNm5jeHLgy2sf1/1cd3Ta03ELh66nt+0Vzntw7868OXXxshX5VnJ+u2gEjtZP0Y5jc6TAE+yjt3x/cAX97oHG1p8jFwBYX3AY+JeBgAdypoEkHDBIg4QJGtIBhUrZ4UkhZ22oAQEEFFCAACSWaKKIIHrIAYgimuiiACgSoOIGLIo4oos2FpDijBnU2CKONu7IYwUggnjAATkmWcCRRco45ARNHqlkjkwW+SSUBBypJZJLcrlllVdKYOSXIkrZ5ZZCPhnll2xWmeaQa7b5ZZNhYjmmnHTWaWeWch6Qp557svknoIHOaSWhFqw5KKIUKHoooxc0+SakREpKKY1OXvphppp2emUEADs=',

    // green
    'R0lGODlhWgCOAOMIAGZcXF+MoQDPJaGhoeOoS4XD4M/Pz+PeS////////////////////////////////yH5BAEKAAgALAAAAABaAI4AAAT+EMlJq7046827/2AojmRpnqhnGGnrZuv6zm8c07hp23kP7jufcAPkDY+VYhCJVAKZQ2cR6pM+qTjrFDvTXrkt7xaMEn/JJfMYPVKf2T/3G96Rz+lEuxFf1y/5eX43gIGCLIQwhnuISYqDjI2Oh5ATkouQlo+UmTKUEpyTmKChiKOkhKaeqaKrpaaneK+wdLKso4xqAroCaq5eu7tmvlbAwGLDUsXBXshKysZazUXPy1bSO9TQUqha2dXbfL/evNHhxOO65bHn6Oq07OPucN3o5ODrTvXfa/PJ+vZKAMFrd+9dvn/WzB3UlxCfM4QF+y2s19DgQ4YR2QyMlxHNRm/+FSVepNiRzMdsITX6w+hE4EqSLRWOJBjT4UyUKT2eVCZP5UuQOU3uLNZT59B0RYUeBVjT4kRqzGT+JBrV5lOqScGYgXpM6lSkVZ1u7OUVnhuXsjpZbSWWrchaZW/FBYU2bV24a+XmpTuX091XgAYINiV4QODBowofHkBYMJ3ChRtDRgMZMajKhslglqwYC+bIggAAKPLZMZPSjEOPBoIaCmo/omOvjtF6CGrQdmSL3nHbdI7eqXPr5t3bB3DYw20AN94buWzit5nfdh4beu3fzfXonr1ieY/s2pMrj/79taLdSshj/4zAEfop13FgjqRXwvzyk+lnsnB/fWf9jlzD0J98vmGwnwb/EZiZBpJwkCANDxpoSAcRKmWHJ4WQhaEGBBBQQAEBhCjiiB92uCEHHX444ooBlEjAiRuk+CGIK85YgIkwZiCjijXOiGOOFXTY4QEH2GhkAUQK+SKQEyhJ5JE2Jikkk00SQOSVRSKZJZZSUinBkFx++KSWWP7IpJNcpimlmUCiqSaXSnpZJZhvxinnnFa+eYCdd+KZJp99+gnnlIFagCaghVJwKKGJXqAkm40G+WikMS5JKYeWXqoplREAADs=',

    // red
    'R0lGODlhWgCOAOMIAOofH2ZcXF+MoaGhoeOoS4XD4M/Pz+PeS////////////////////////////////yH5BAEKAAgALAAAAABaAI4AAAT+EMlJq7046827/2AojmRpnqhnGGnrZuv6zm8c07hp23kP7jufcAPkDY+VYhCJVAKZQ2cR6pM+qTjrFDvTXrkt7xaMEn/JJfMYPVKf2T/3G96Rz+lEuxFf1y/5eX43gIGCLIQwhnuISYqDjI2Oh5ATkouQlo+UmTKUEpyTmKChiKOkhKaeqaKrpaaneK+wdLKso4xqALoAaq5eu7tmvlbAwGLDUsXBXshKysZazUXPy1bSO9TQUqha2dXbfL/evNHhxOO65bHn6Oq07OPucN3o5ODrTvXfa/PJ+vZKAMFrd+9dvn/WzB3UlxCfM4QF+y2s19DgQ4YR2QyMlxHNRm/+FSVepNiRzMdsITX6w+hE4EqSLRWOJBjT4UyUKT2eVCZP5UuQOU3uLNZT59B0RYUeBVjT4kRqzGT+JBrV5lOqScGYAcC1K1dhUqd+PRZ2aq+yL924lNXJaiunr9aylVsLLSi6ce1ywvtWZF23t/RmAjSgsKnCAwgbHoVY8YDDhekgRgx5MprJi0FhTkxmc+XGWDZTFhQgQBHRkZmgfkzaNJDVUFb7KU3bdQzYQ1aPtlO79A7dqXMAZ82792/gPobPNm5jeHLgy2sf1/1cd3Ta03ELh66nt+0Vzntw7868OXXxshX5VnJ+u2gEjtZP0Y5jc6TAE+yjt3x/cAX97oHG1p8jFwBYX3AY+JeBgAdypoEkHDBIg4QJGtIBhUrZ4UkhZ22oAQEEFFCAACSWaKKIIHrIAYgimuiiACgSoOIGLIo4oos2FpDijBnU2CKONu7IYwUggnjAATkmWcCRRco45ARNHqlkjkwW+SSUBBypJZJLcrlllVdKYOSXIkrZ5ZZCPhnll2xWmeaQa7b5ZZNhYjmmnHTWaWeWch6Qp557svknoIHOaSWhFqw5KKIUKHoooxc0+SakREpKKY1OXvphppp2emUEADs='

];


/** TOOLS */

function random(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}

function createCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
}

function disableCanvasSmoothness(context) {
    context.mozImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
}

function loadImages(base64, callback) {

    var images = [],
        load = function () {
            var dataString = base64.shift(),
                image = new Image();
            image.onload = function () {
                images.push(this); // image
                base64.length ? load() : callback(images);
            };
            image.src = 'data:image/gif;base64,' + dataString;
        };

    load();

}


/** TEXTURE */

function Texture(w, h, colors) {

    var self = this;

    self.colors = colors;

    self.canvas = createCanvas(w, h);
    self.ctx = self.canvas.getContext('2d');
    disableCanvasSmoothness(this.ctx);

    self.imageData = self.ctx.createImageData(w, h);

}

Texture.prototype.generate = function () {

    var self = this,
        data = self.imageData.data,
        color,
        i;

    // Fill ImageData object with random colors.
    for (i = 0; i < data.length; i += 4) {
        color = self.colors[random(0, self.colors.length - 1)];
        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = 255;
    }

    self.ctx.putImageData(self.imageData, 0, 0);

    self.ctx.save();
    self.ctx.scale(4, 4);
    self.ctx.drawImage(self.canvas, 0, 0);
    self.ctx.restore();

    // Return a texture pattern.
    return self.ctx.createPattern(self.canvas, 'repeat');

};


/** CAMERA */

function Camera(elem) {

    this.elem = elem;
    this.ctx = elem.getContext('2d');

    this.resize();

    this.texture = new Texture(320, 350, [
        [41, 2, 100],
        [47, 5, 107],
        [37, 3, 93],
        [0, 2, 96]
    ]).generate();

}

Camera.prototype.resize = function () {
    this.w = this.elem.width = this.elem.clientWidth;
    this.h = this.elem.height = 350;
};

Camera.prototype.clear = function () {
    this.ctx.fillStyle = this.texture;
    this.ctx.fillRect(0, 0, this.w, this.h);
};

Camera.prototype.draw = function (arr) {

    var len = arr.length,
        unit,
        h;

    while (len--) {
        unit = arr[len];
        h = (unit.ay || unit.isMoving) ? unit.h : unit.h - 22;
        this.ctx.drawImage(unit.image, 0, 0, unit.w, h, unit.x, unit.y, unit.w, h);
    }

};


/** ROCKETS */

function Rocket(x, y, image, binder) {

    this.x = x;
    this.y = this.startY = y + 22;

    this.w = 90;
    this.h = 142;

    this.ay = 0;

    this.image = image;

    this.isMoving = false;

    binder(this);

}

Rocket.prototype.tick = function () {

    if (this.ay < 0) {
        this.ay++;
    } else {
        this.ay = 0;
    }

    if (this.y <= -this.h) {
        this.ay = 0;
        this.y = this.startY;
    }

    this.y += this.ay;

};

Rocket.prototype.move = function (y) {

    var self = this;

    clearTimeout(this.moveTimer);

    this.y -= y || 2;
    this.isMoving = true;

    this.moveTimer = setTimeout(function () {
        self.isMoving = false;
    }, 80);

};

Rocket.prototype.accelerate = function () {
    this.ay = -10;
};