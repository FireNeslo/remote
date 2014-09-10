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