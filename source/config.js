var _ = require('lodash');
var $ = require('jquery');

window.$ = $;

var objects = [];
var requests = [
	[]
];

window.requests = requests;

var requestInProgress = false;

function getRequest(deferred) {
	var data = _.find(requests, function(req, index) {
		return req.length;
	});

	if (!data) {
		if (requestInProgress) {
			setTimeout(function() {
				return getRequest(deferred);
			}, 50);
		} else {
			requestInProgress = true;
			$.get('/apod/images?page=' + requests.length).then(function(resp) {
				if(requests.length > 30) {
					requests = [];
				}
				requestInProgress = false;
				requests.push(resp);
				getRequest(deferred);
			});
		}
	} else {
		deferred.resolve(data.shift());
	}
}

module.exports = {
	globalXOffset: 0,
	globalYOffset: 0,
	objectCache: [],
	getObject: function() {
		var deferred = new $.Deferred();
		getRequest(deferred);
		return deferred.promise();
	}
}
