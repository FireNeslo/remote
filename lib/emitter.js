var remote = require('..');
/**
 * Remote for event emitters 
 * @module nslo-remote/emitter
 * @class remote/lib/emitter
 * @param {string} name - reference id for the remote
 * @param {Emitter} emitter - event emitter
 * @param {object} [object] - object to share
 * @return {Remote} remote - remote interface object
**/
function RemoteEmitter (name, emitter, value) {'use strict';
	var adapter = {
		postMessage : function(data) {
			emitter.emit(name, data);
		}
	};
	emitter.on(name, function(data) {
		adapter.onMessage({data: data});
	});
	return remote(adapter, value);
}

module.exports = RemoteEmitter;