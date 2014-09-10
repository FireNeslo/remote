nslo-remote - v0.0.0
===
Will let you manipulate remote objects
## Install
### npm
```bash
$ npm install FireNeslo/remote --save
```
### bower
```bash
$ bower install FireNeslo/remote --save
```
## Test
```bash
$ npm install -g mocha
$ npm test
```
## Usage
### Message Api adapter
#### demo/message/server.js
```js
var remote = require('../..');


module.exports = function(delay) {
	delay || (delay = 0);
	var serverAdapter = {
		postMessage : function (data) {
			setTimeout(function() {
				clientAdapter.onMessage({data:data})
			}, delay)
		}
	};
	var clientAdapter = {
		postMessage : function (data) {
			setTimeout(function() {
				serverAdapter.onMessage({data:data})
			}, delay)
		}
	};
	var server = remote(serverAdapter, {
		object : {
			value : "value",
			method : function(value) {
				return "confirm: "+ value;
			}
		}
	});
	return clientAdapter;
};
```
#### demo/message/client.js
```js
var remote = require('../..');
var server = require('./server');
var client = remote(server(1000));
var object = client.get('object')
object.get('value').
	then(function (val) {
		console.log('get: ', val);
		return object.put('cool', 'stuff')
	}).
	then(function(val) {
		console.log('put: ', val);
		return object.post('method',['hello'])
	}).
	then(function(val) {
		console.log('post: ', val);
		return object.delete('cool');
	}).
	then(function(val) {
		console.log('delete: ',val);
	});
```
### Emitter Api adapter
#### demo/emitter/server.js
```js
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
```
#### demo/emitter/client.js
```js
var Remote  = require('../../lib/emitter');
var server  = require('./server');
var client  = Remote('api', server);

client.then(function(val) {
	console.log(val);
})

/* and you could potentially do more stuff here */
```
##API

<!-- Start /home/fireneslo/Dropbox/nslo/remote/index.js -->

## remote(adapter, [object])

Remote object 

### Params: 

* **object** *adapter* - message adapter
* **object** *[object]* - object to share

### Return:

* **Remote** remote - remote interface object

<!-- End /home/fireneslo/Dropbox/nslo/remote/index.js -->




<!-- Start /home/fireneslo/Dropbox/nslo/remote/lib/emitter.js -->

## remote/lib/emitter

Remote for event emitters 

### Params: 

* **string** *name* - reference id for the remote
* **Emitter** *emitter* - event emitter
* **object** *[object]* - object to share

### Return:

* **Remote** remote - remote interface object

<!-- End /home/fireneslo/Dropbox/nslo/remote/lib/emitter.js -->




<!-- Start /home/fireneslo/Dropbox/nslo/remote/lib/remote.js -->

## remote/lib/remote

Remote for event emitters 

### Params: 

* **object** *object* - api object
* **request** *request* - request action
* **array** *[actions]* - list of actions

## get

Get a key

### Params: 

* **string** *key* - the key to get

## put

Set key to value

### Params: 

* **string** *key* - the key to set
* **string** *value* - the value to set

## post

Apply method

### Params: 

* **string** *method* - the method name
* **string** *args* - the method arguments

## delete

Delete key

### Params: 

* **string** *key* - key to delete

## then([cb], [eb], [pb])

Thenable

### Params: 

* **function** *[cb]* - success callback
* **function** *[eb]* - error callback
* **function** *[pb]* - progress callback

### Return:

* **Promise** result

<!-- End /home/fireneslo/Dropbox/nslo/remote/lib/remote.js -->

