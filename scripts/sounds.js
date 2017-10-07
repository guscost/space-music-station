blip.loadSamples({
    'untitled': 'sounds/untitled.mp3'
  })
  .then(callback);

var testLoop = null;
function callback() {
    var untitled = blip.clip().sample('untitled');
    testLoop = blip.loop()
        .tempo(20)
        .tick(function(t,d) {
            if (blip.chance(1/3)) {    
                console.log('asdfdasfsad')
            }
            untitled.play(t, { 'rate': blip.random(0.2, 1.4) });
        });
}
