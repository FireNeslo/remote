var Remote  = require('../../lib/emitter');
var server  = require('./server');
var client  = Remote('api', server);

client.then(function(val) {
	console.log(val);
})

/* and you could potentially do more stuff here */