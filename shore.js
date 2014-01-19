var analyser;
var xpos = 0;
var interval;
var c;
var ctx;
var analyser;
var frequencyData;
var visualisation;

function shore(params) {
    // defaults
    params.view = params.view || 'view';
    params.source = params.source || 'source';
    params.color = params.color || 'screen';

    // load params into global var
    var params = params;

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
        ctx.fillRect(xpos, (200 - (frequencyData[0] * 0.40)), 1, 200);
        xpos = xpos + 1;
    }
}