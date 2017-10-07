var a = autotroph;
var p = protozoa;

// App component
var app = p({
    tag: 'h1',
    ch: 'test',
    style: 'cursor: pointer',
    onclick: function () {
        a.dispatch({ type: 'TOGGLE_SOUND' });
    }
});

// Mount the application
document.querySelector('#protozoa-mount').appendChild(app);
