'use strict';

var http = require('http')
, log = require('winston')
, TrustedClient = require('../').TrustedClient
, fs = require('fs')
;

var clientOptions = {
	log: log,
	baseUrl: 'http://localhost:3000',
	httpSignature: {
		key: fs.readFileSync('./key.pem', 'ascii'), //fs.readFileSync('./badkey.pem', 'ascii'),
		keyId: './cert.pem'
	}
};

var client = new TrustedClient(clientOptions);
client.get({ path: '' }, function (err, res) {
	console.log('get: '.concat(err || res));
});