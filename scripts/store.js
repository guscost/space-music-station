var store = autotroph.createStore({
    soundPlaying: false
}, function (state, action) {
    switch (action.type) {
        case 'TOGGLE_SOUND':
            if (state.soundPlaying) {
                state.soundPlaying = false;
                testLoop.stop();
            } else {
                state.soundPlaying = true;
                testLoop.start();
            }
    }
});
