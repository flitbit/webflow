'use strict';

var dbc         = require('dbc.js')
, util          = require('util')
, extend        = util._extend
, Hooked        = require('hooked').Hooked
, Success       = require('./success')
, ResourceError = require('./errors')
, httpSignature = require('http-signature')
;

var __sequence = 0;

function TrustedServer(options) {
	TrustedServer.super_.call(this);
	if (options && options.log) {
		var log = options.log;
	}
	Object.defineProperty(this, '_log', {
		value: function(level, msg, data) {
			if (log) {
				if ('undefined' !== typeof data) log[level](msg, data);
				else log[level](msg);
			}
		}
	});
}
util.inherits(TrustedServer, Hooked);

Object.defineProperties(TrustedServer.prototype, {

	connect: {
		enumerable: true,
		value: function() {
			var server = this;
			return function(req, res, next) {
				try {
					var check = server.checkClient(req);
					if (server && server.checkClient && check && check.success && req.headers['http-signature']) {
						req.trustedClientId = check.result.trustedClientId;
						next();
					} else {
						throw ResourceError.unexpected(check);
					}
				} catch (err) {
					if (err.name === 'MissingHeaderError') {
						err = ResourceError.forbidden();
					} else if (!err.httpEquivalent) {
						err = ResourceError.internalServerError();
					}
					res.setHeader('content-type', 'application/json');
					res.writeHead(err.httpEquivalent);
					res.write(JSON.stringify(err));
					res.end();
				}
			}
		}
	},

	getSignatureKey: {
		value: function(keyId) {
			return undefined;
		},
		enumerable: true
	},

	checkClient: {
		enumerable: true,
		value: function(req) {
			var e, keyId
			;
			var parsed = httpSignature.parseRequest(req);
			keyId = parsed.params.keyId;
			var pub = this.getSignatureKey(keyId);
			if (pub) {
				if (httpSignature.verifySignature(parsed, pub)) {
					this._log('info', 'HTTP Signature - verified trusted client: `'.concat(keyId, '`.'));
					return Success.ok({ trustedClientId: keyId });
				} else {
					this._log('info', 'HTTP Signature - trusted client signature invalid; trustedClientId: `'.concat(keyId, '`.'));
					throw ResourceError.unauthorized("Trusted client signature invalid.");
				}
			} else {
				this._log('info', 'HTTP Signature - unknown client identity: `'.concat(keyId, '`.'));
			}
			throw ResourceError.forbidden('Not a trusted client.');
		}
	}
});

Object.defineProperties(TrustedServer, {

	create: {
		enumerable: true,
		value: function(options) {
			return new TrustedServer(options);
		}
	},

	connect: {
		enumerable: true,
		value: function(options) {
			return TrustedServer.create(options).connect();
		}
	}

});

module.exports = TrustedServer