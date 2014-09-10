var Remote  = require('../../lib/emitter');
var Emitter = require('events');
var serverEmitter = new Emitter();
var clientEmitter = new Emitter();
var clientEmit    = clientEmitter.emit;
var serverEmit    = serverEmitter.emit;
// just pipes over all events
// if you are using socket.io this is not necessary
serverEmitter.emit = function() {
	clientEmit.apply(clientEmitter, arguments);
	return serverEmitter;
};
clientEmitter.emit = function() {
	serverEmit.apply(serverEmitter, arguments);
	return clientEmitter;
};

var server = new Remote('api',serverEmitter, {"value" : "something"})

module.exports = clientEmitter;