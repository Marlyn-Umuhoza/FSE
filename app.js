const EventEmitter = require('events');

const emitter = new EventEmitter();
 
//Registering a listener
emitter.on('messageLogged', function(){
    console.log('Listener called');
});

//Raising the event
emitter.emit('messageLogged');