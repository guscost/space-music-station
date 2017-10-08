
// Container for one control
function controlParam (ref, label, min, max, value, oninput) {
    return {
        ref: ref,
        tag: 'div',
        class: 'form-group',
        ch: [{
            tag: 'label',
            ch: label,
        }, {
            ref: 'input',
            tag: 'input',
            type: 'range',
            class: 'form-control',
            min: min,
            max: max,
            value: value,
            oninput: oninput
        }]
    };
}

// Sample controls
function sampleControls (key) {
    return [
        controlParam(
            'gainGroup',
            'Gain',
            0,
            1000,
            1000,
            function (event) {
                audio[key].gain.gain.value = 
                    parseFloat(event.target.value) / 1000;
            }
        ),
        controlParam(
            'panGroup',
            'Pan',
            -1000,
            1000,
            0,
            function (event) {
                audio[key].pan.pan.value = 
                    parseFloat(event.target.value) / 1000;
            }
        ),
        controlParam(
            'filterFreqGroup',
            'Filter Frequency',
            200,
            6000,
            2000,
            function (event) {
                audio[key].filter.frequency.value = 
                    parseFloat(event.target.value);
            }
        ),
        controlParam(
            'rateGroup',
            'Rate',
            0,
            1000,
            1000,
            function (event) {
                audio[key].source.playbackRate.value = 
                    parseFloat(event.target.value) / 1000;
            }
        )
    ];
}

// Oscillator controls
function oscillatorControls (key) {
    return [
        controlParam(
            'gainGroup',
            'Gain',
            0,
            1000,
            1000,
            function (event) {
                audio[key].gain.gain.value =     
                    parseFloat(event.target.value) / 10000;
            }
        ),
        controlParam(
            'panGroup',
            'Pan',
            -1000,
            1000,
            0,
            function (event) {
                audio[key].pan.pan.value = 
                    parseFloat(event.target.value) / 1000;
            }
        ),
        controlParam(
            'frequencyGroup',
            'Oscillator Frequency',
            60,
            600,
            180,
            function (event) {
                audio[key].source.frequency.value = 
                    parseFloat(event.target.value);
            }
        )
    ];
}

// Noise controls
function noiseControls (key) {
    return [
        controlParam(
            'gainGroup',
            'Gain',
            0,
            1000,
            500,
            function (event) {
                audio[key].gain.gain.value = 
                    parseFloat(event.target.value) / 10000;
            }
        ),
        controlParam(
            'panGroup',
            'Pan',
            -1000,
            1000,
            0,
            function (event) {
                audio[key].pan.pan.value = 
                    parseFloat(event.target.value) / 1000;
            }
        ),
        controlParam(
            'filterFreqGroup',
            'Filter Frequency',
            200,
            6000,
            2000,
            function (event) {
                audio[key].filter.frequency.value = 
                    parseFloat(event.target.value);
            }
        )
    ];
}

// Card component for a sound
function soundCard(key, name, controls) {
    return {
        ref: key,
        tag: 'div',
        class: 'col-md-4',
        ch: {
            ref: 'card',
            tag: 'div',
            class: 'card text-white bg-secondary mb-3',
            style: 'margin-top: 20px',
            ch: {
                ref: 'body',
                tag: 'div',
                class: 'card-body',
                ch: {
                    ref: 'form',
                    tag: 'form',
                    ch: [{
                        ref: 'toggle',
                        tag: 'div',
                        class: 'form-group',
                        ch: {
                            tag: 'input',
                            type: 'button',
                            class: 'btn btn-dark',
                            style: 'cursor: pointer',
                            value: name,
                            onclick: function (event) {
                                if (audio[key].playing()) {
                                    event.target.className = 'btn btn-dark';
                                    audio[key].stop();
                                } else {
                                    event.target.className = 'btn btn-info';
                                    audio[key].start();
                                }
                            }
                        }
                    }].concat(controls(key))
                }
            }
        }
    };
}


// App component https://www.liveatc.net/play/klax3.pls
function app () {
    return {
        ref: 'controls',
        tag: 'div',
        class: 'row',
        ch: [
            soundCard('chimes', 'CHIMES', sampleControls),
            soundCard('hum', 'HUM', sampleControls),
            soundCard('whip', 'WHIP', sampleControls),
            soundCard('plazaWind', 'PLAZA WIND', sampleControls),
            soundCard('guitar', 'GUITAR', sampleControls),
            soundCard('reading', 'READING', sampleControls),
            soundCard('sine', 'SINE WAVE', oscillatorControls),
            soundCard('square', 'SQUARE WAVE', oscillatorControls),
            soundCard('sawtooth', 'SAWTOOTH WAVE', oscillatorControls),
            soundCard('whiteNoise', 'WHITE NOISE', noiseControls),
            soundCard('pinkNoise', 'PINK NOISE', noiseControls),
            soundCard('brownNoise', 'BROWN NOISE', noiseControls)
        ]
    };
}

// Mount the application
var start = function () {
    var live = protozoa(app());
    document.querySelector('#protozoa-mount').appendChild(live);

    function alterOscillators () {
        var cards = _.filter(live.ch, function (card) {
            var sound = audio[card.ref];
            return sound && sound.playing() && !!sound.source.frequency;
        });

        cards.forEach(function (card) {
            var sound = audio[card.ref];
            var value = Math.min(400, Math.max(80, sound.source.frequency.value + Math.floor(Math.random() * 200) - 100));
            card.card.body.form.frequencyGroup.input.value = value;
            sound.source.frequency.linearRampToValueAtTime(
                value,
                audio.ctx.currentTime + Math.random() * 4
            );
            var value = Math.random() / 20;
            card.card.body.form.gainGroup.input.value = value * 1000;
            sound.gain.gain.linearRampToValueAtTime(
                value,
                audio.ctx.currentTime + Math.random() * 3
            )
        });
        setTimeout(alterOscillators, Math.random() * 1000 + 2000);
    }
    alterOscillators();

    
    function alterRandomSample () {
        var cards = _.filter(live.ch, function (card) {
            var sound = audio[card.ref];
            return sound && sound.playing() && !!sound.source.playbackRate;
        });

        if (cards.length) {
            var card = _.sample(cards);
            var sound = audio[card.ref];
            var value = Math.random() / 2 + 0.25;
            card.card.body.form.rateGroup.input.value = value * 1000;
            sound.source.playbackRate.linearRampToValueAtTime(
                value,
                audio.ctx.currentTime + Math.random() * 10
            )
        }
        setTimeout(alterRandomSample, Math.random() * 3000 + 2000);
    }
    alterRandomSample();


    function alterRandomSound () {
        var cards = _.filter(live.ch, function (card) {
            var sound = audio[card.ref];
            return sound && sound.playing();
        });
        if (cards.length) {
            var card = _.sample(cards);
            var sound = audio[card.ref];
            var value = Math.random() - 0.5;
            card.card.body.form.panGroup.input.value = value * 1600;
            sound.pan.pan.linearRampToValueAtTime(value, audio.ctx.currentTime + Math.random() * 5);

            var card = _.sample(cards);
            var sound = audio[card.ref];
            var value = Math.min(6000, Math.max(200, sound.filter.frequency.value + Math.floor(Math.random() * 1800) - 900));
            card.card.body.form.filterFreqGroup.input.value = value;
            sound.filter.frequency.linearRampToValueAtTime(
                value,
                audio.ctx.currentTime + Math.random() * 20
            )
            setTimeout(alterRandomSound, Math.random() * 3000 + 2000);
        }
    }
    alterRandomSound();
}
