'use strict';

var util = require('util')
, httpSignature = require('http-signature')
, TrustedServer = require('../').TrustedServer
, config = require('./trusted_server_config.json')
;

function TrustedServerImplementation(options) {
	TrustedServerImplementation.super_.call(this, options);
}
util.inherits(TrustedServerImplementation, TrustedServer);

Object.defineProperties(TrustedServerImplementation.prototype, {
	checkClient: {
		enumerable: true,
		value: function(req) {
			var parsed = httpSignature.parseRequest(req);
			var pub = config.keys[parsed.keyId];
			this._log('info', 'client signature provided -- verifying...');
			return httpSignature.verifySignature(parsed, pub);
		}
	}
});

Object.defineProperties(TrustedServerImplementation, {

	create: {
		enumerable: true,
		value: function(options) {
			return new TrustedServerImplementation(options);
		}
	}

});

module.exports = TrustedServerImplementation;