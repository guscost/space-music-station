
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

// Sound control card
function soundControl (key, name) {
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
                    }, controlParam(
                        'gainGroup',
                        'Gain',
                        0,
                        1000,
                        1000,
                        function (event) {
                            audio[key].gain.gain.value = 
                                parseFloat(event.target.value) / 1000;
                        }
                    ), controlParam(
                        'panGroup',
                        'Pan',
                        -1000,
                        1000,
                        0,
                        function (event) {
                            audio[key].pan.pan.value = 
                                parseFloat(event.target.value) / 1000;
                        }
                    ), controlParam(
                        'filterFreqGroup',
                        'Filter Frequency',
                        200,
                        6000,
                        2000,
                        function (event) {
                            audio[key].filter.frequency.value = 
                                parseFloat(event.target.value);
                        }
                    ), audio[key].source.playbackRate ? controlParam(
                        'rateGroup',
                        'Rate',
                        0,
                        1000,
                        1000,
                        function (event) {
                            audio[key].source.playbackRate.value = 
                                parseFloat(event.target.value) / 1000;
                        }
                    ) : '']
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
            soundControl('chimes', 'Chimes'),
            soundControl('hum', 'Hum'),
            soundControl('whip', 'Whip'),
            soundControl('plazaWind', 'Plaza Wind'),
            soundControl('guitar', 'Guitar'),
            soundControl('wineGlass', 'Wine Glass'),
            soundControl('whiteNoise', 'White Noise'),
            soundControl('pinkNoise', 'Pink Noise'),
            soundControl('brownNoise', 'Brown Noise')
        ]
    };
};

// Mount the application
var start = function () {
    document.querySelector('#protozoa-mount').appendChild(protozoa(app()));
}
