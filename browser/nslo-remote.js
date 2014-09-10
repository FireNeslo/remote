!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.remote=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./lib/remote":2}],2:[function(require,module,exports){
/**
 * Remote for event emitters 
 * @module nslo-remote/remote
 * @class  remote/lib/remote
 * @param {object}   object    - api object
 * @param {request}  request   - request action
 * @param {array}    [actions] - list of actions
 * @returns {Remote} remote    - remote interface object
**/
function Remote(object, request, actions, id) {'use strict';
  if(!this) return new Remote(object, request, actions);
  if(!actions) actions = [];
  function method(name) {
    return function(key, value) {
      var action = {
        key   : key,
        method: name,
        value : value
      };
      return new Remote(object, request, [action].concat(actions));
    };
  }
  /**
   * Get a key
   * @param {string} key - the key to get
  **/
  this.get    = method('get');
  /**
   * Set key to value
   * @param {string} key - the key to set
   * @param {string} value - the value to set
  **/
  this.put    = method('put');
  /**
   * Apply method
   * @param {string} method - the method name
   * @param {string} args   - the method arguments
  **/
  this.post   = method('post');
  /**
   * Delete key
   * @param {string} key - key to delete
  **/
  this.delete = method('delete');
  /**
   * Thenable
   * @param {function} [cb] - success callback
   * @param {function} [eb] - error callback
   * @param {function} [pb] - progress callback
   * @return {Promise} result
  **/
  this.then = function then(cb,eb,pb) {
    return (then.data||(then.data=request(actions))).then(cb,eb,pb);
  };
  this.resolve = function(actions) {
    var action, value = object;
    for(var i = actions.length-1; i >= 0 ; i--) {
      action = actions[i];
      switch(action.method) {
        case "get": value = value[action.key]; break;
        case "put": value = value[action.key] = action.value; break;
        case "post": value = value[action.key].apply(value, action.value); break;
        case "delete": value = delete value[action.key]; break;
      }
    }
    return value;
  };
}
module.exports = Remote;
},{}]},{},[1])(1)
});
//# sourceMappingURL=nslo-remote.js.map