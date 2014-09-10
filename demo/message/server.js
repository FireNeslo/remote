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