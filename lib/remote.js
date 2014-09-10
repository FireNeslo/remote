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