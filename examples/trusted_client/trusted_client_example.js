'use strict';

var http = require('http')
, log = require('winston')
, config = require('./trusted_client_config.json')
, TrustedClient = require('../../').TrustedClient
;

var clientOptions = {
	log: log,
	baseUrl: 'http://localhost:3000',
	httpSignature: {
		key: config.keys.trustedClientExampleKey.priv,
		keyId: 'trustedClientExampleKeyId'
	}
};

var client = new TrustedClient(clientOptions);
client.get({ path: '' }, function (err, res) {
	if (err) {
		console.log('error: '.concat(err));
	} else {
		console.log('request successful');
	}
});