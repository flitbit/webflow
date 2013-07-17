'use strict';

var dbc         = require('dbc.js')
, util          = require('util')
, extend        = util._extend
, utils         = require('./utils')
, Hooked        = require('Hooked').Hooked
, Success       = require('./success')
, ResourceError = require('./errors')
;

var __sequence = 0;

function TrustedServer(options) {
	TrustedServer.super_.call(this);
	if (options && options.log) {
		var log = options.log;
	}
	Object.defineProperty(this, '_log', {
		value: utils._log.bind(this, log)
	});
}
util.inherits(TrustedServer, Hooked);

Object.defineProperties(TrustedServer.prototype, {

	connect: {
		enumerable: true,
		value: function(server) {
			return function(req, res, next) {
				var valid = false;
				try {
					if (server.checkClient(req) === true) {
						valid = true;
					}
				} catch (err) {}
				if (valid) {
					return next();
				}
				server._log('info', 'Request denied', req);
				res.setHeader('content-type', req.headers['content-type'] || 'application/json');
				res.writeHead(403);
				res.end();
			}
		}
	},

	checkClient: {
		enumerable: true,
		value: function(req) {
			this.log('warn', 'signature check not implemented -- denying request');
			return false;
		}
	}
});

Object.defineProperties(TrustedServer, {

	create: {
		enumerable: true,
		value: function(options) {
			return new TrustedServer(options);
		}
	}

});

module.exports = TrustedServer