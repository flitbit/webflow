'use strict';

var dbc         = require('dbc.js')
, httpSignature = require('http-signature')
, util          = require('util')
, extend        = util._extend
, Success       = require('./success')
, ResourceError = require('./errors')
;

var options = {};

module.exports = function $init($trusted_server_config) {
	extend(options, $trusted_server_config || {});
	dbc('object' === typeof options.httpSignature, "options (argument 1) must provide have an httpSignature property.");
	return trusted_server;
};

// connect `use`
//
function trusted_server(req, res, next) {
	try {
		var parsed = httpSignature.parseRequest(req);
		var pub = require('fs').readFileSync(parsed.keyId, 'ascii');
		if (httpSignature.verifySignature(parsed, pub)) {
			return next();
		}
	} catch (err) {	}
	res.setHeader('content-type', req.headers['content-type'] || 'application/json');
	res.writeHead(403);
	res.end();
};

// flatiron `use`
//
Object.defineProperties(trusted_server, {

	attach: {
		enumerable: true,
		value: function () {
		// flatiron wireup code here
		dbc(!!this.http, '`flatiron.plugins.http` must be used before the `trusted_server` module');
		this.http.before.push(trusted_server);
	}
},

init: {
	enumerable: true,
	value: function () {
		// flatiron init code here -- no initialization required for `trusted_server`
	}
}
});