var Remote = require('./lib/remote');
/**
 * Remote object 
 * @module nslo-remote
 * @param {object} adapter  - message adapter
 * @param {object} [object] - object to share
 * @return {Remote} remote - remote interface object
**/
function remote(adapter, object) {'use strict';
  var current, id = 0, pending = {}, events = {
    "request" : function(event) {
      var value = null, type = "response";
      try {
        value = current.resolve(event.value);
      } catch(error) {
        value = error;
        type = "error";
      }
      adapter.postMessage({
        id: event.id,
        type : type,
        value: value
      });
    },
    "response": function(event) {
      if(pending[event.id]) pending[event.id].resolve(event.value);
      delete pending[event.id];
    },
    "error": function(event) {
      if(pending[event.id]) pending[event.id].reject(event.value);
      delete pending[event.id];
    }
  };
  adapter.onMessage = function(message) {
    events[message.data.type](message.data);
  };  
  return (current = new Remote(object, function(meta) {
    return new Promise(function(resolve, reject) {
      pending[id] = {
        resolve : resolve,
        reject  : reject
      };
      adapter.postMessage({
        id: id++,
        type: 'request',
        value:meta
      });
    });
  }));
}

module.exports = remote;