'use strict';

var connect = require('connect')
, log = require('winston')
, TrustedServer = require('../').TrustedServer
, fs = require('fs')
;

var serverOptions = {
	log: log,
	httpSignature: {
		key: fs.readFileSync('./key.pem', 'ascii'),
		cert: fs.readFileSync('./cert.pem', 'ascii')
	}
};

connect()
	.use(TrustedServer(serverOptions))
	.use(function (req, res) {
		log.info('Request validated');
		res.setHeader('content-type', 'application/json');
		res.writeHead(200);
		res.end();
	}).listen(3000);

log.info('Server started\r\n--');