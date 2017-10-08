// The MIT License (MIT)
//
// Copyright (c) 2013 Zach Denton
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
(function(AudioContext) {
	AudioContext.prototype.createWhiteNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				output[i] = Math.random() * 2 - 1;
			}
		}
		return node;
	};

	AudioContext.prototype.createPinkNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var b0, b1, b2, b3, b4, b5, b6;
		b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				var white = Math.random() * 2 - 1;
				b0 = 0.99886 * b0 + white * 0.0555179;
				b1 = 0.99332 * b1 + white * 0.0750759;
				b2 = 0.96900 * b2 + white * 0.1538520;
				b3 = 0.86650 * b3 + white * 0.3104856;
				b4 = 0.55000 * b4 + white * 0.5329522;
				b5 = -0.7616 * b5 - white * 0.0168980;
				output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
				output[i] *= 0.11; // (roughly) compensate for gain
				b6 = white * 0.115926;
			}
		}
		return node;
	};

	AudioContext.prototype.createBrownNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var lastOut = 0.0;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				var white = Math.random() * 2 - 1;
				output[i] = (lastOut + (0.02 * white)) / 1.02;
				lastOut = output[i];
				output[i] *= 3.5; // (roughly) compensate for gain
			}
		}
		return node;
	};
})(window.AudioContext || window.webkitAudioContext);


// Global audio module
var audio = (function () {

    // Audio context
    var ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Sample library
    var library = {};

    // Helper function to get a "player" for a sound
    function player (source) {
        var _playing = false;

        // Processing nodes
        var filter = ctx.createBiquadFilter();
        var distortion = ctx.createWaveShaper();
        var compressor = ctx.createDynamicsCompressor();
        //var reverb = ctx.createConvolver();
        var pan = ctx.createStereoPanner();
        var gain = ctx.createGain();

        // Initial settings
        filter.type = 'bandpass'
        filter.frequency.value = 2000
        filter.gain.value = 0

        //reverb.buffer = new AudioBuffer([1, 19, 892])

        // Connect up the signal path
        source.connect(filter);
        filter.connect(distortion);
        distortion.connect(compressor);
        //compressor.connect(reverb);
        compressor.connect(pan);
        pan.connect(gain);

        // Functions to start and stop
        function start() {
            _playing = true;
            gain.connect(ctx.destination);
        }
        function stop() {
            _playing = false;
            gain.disconnect();
        }

        // Check if a sound is playing
        function playing() {
            return _playing;
        }


        // Public API
        return {
            playing: playing,
            source: source,
            filter: filter,
            distortion: distortion,
            compressor: compressor,
            //reverb: reverb,
            pan: pan,
            gain: gain,
            start: start,
            stop: stop
        };
    }

    // Helper function to get a sound player for a sample
    function loopPlayer (buffer) {
        var source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.start();
        return player(source);
    }

    // Load sound sample player into the library
    function loadSample(name, url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            ctx.decodeAudioData(request.response, function (buffer) {
                library[name] = loopPlayer(buffer);
            });
        };
        request.send();
    }

    // Loop sources
    loadSample('chimes', 'sounds/chimes.mp3');
    loadSample('hum', 'sounds/hum.mp3');
    loadSample('whip', 'sounds/whip.mp3');
    loadSample('plazaWind', 'sounds/plaza_wind.mp3');
    loadSample('guitar', 'sounds/guitar.mp3');
    loadSample('wineGlass', 'sounds/wine_glass.mp3');

    // Noise sources
    library.whiteNoise = player(ctx.createWhiteNoise());
    library.pinkNoise = player(ctx.createPinkNoise());
    library.brownNoise = player(ctx.createBrownNoise());

    // Public API
    library.ctx = ctx;
    return library;
})();
