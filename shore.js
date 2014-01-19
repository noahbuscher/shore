var analyser;
var xpos = 0;
var interval;
var c;
var ctx;
var analyser;
var frequencyData;
var visualisation;
var params;

function shore(paramobj) {
    // defaults
    paramobj.view = paramobj.view || 'view';
    paramobj.source = paramobj.source || 'source';
    paramobj.color = paramobj.color || 'screen';

    // load params into global var
    params = paramobj;

    c = document.getElementById(params.view);
	ctx = c.getContext("2d");
	ctx.fillStyle = params.color;
    if (typeof AudioContext !== "undefined") {
        context = new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
        context = new webkitAudioContext();
    } else {
        $(".hideIfNoApi").hide();
        $(".showIfNoApi").show();
        return;
    }

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                    || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }

    // create analyser
    analyser = context.createAnalyser();
    analyser.fftSize = 64;
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // set up the visualisation
    visualisation = $("#" + params.view);

    // bind to audio source
    $("#" + params.source).bind('canplay', function() {
        var source = context.createMediaElementSource(this);
        source.connect(analyser);
        analyser.connect(context.destination);
    });

    // start the loop
    update();
}

function update() {
    requestAnimationFrame(update);
    analyser.getByteFrequencyData(frequencyData);

    if (frequencyData[0] === 0) {
        // don't log
    } else {
        // the frequencyData multiplier controls the graph scale
        var gradient = ctx.createLinearGradient(0, 0, 0, c.height);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, params.color);
        ctx.fillStyle = gradient;
        xpos = xpos + 1;
        if (xpos >= c.width - 2) {
            xpos = c.width - 3;
            var img = document.createElement('img');
            img.src = c.toDataURL("image/jpg");
            ctx.clearRect (0, 0, c.width, c.height);
            ctx.drawImage(img, -1, 0);
        }
        ctx.fillRect(xpos, (c.height - (frequencyData[0] * params.scale)), 1, c.height);
    }
}