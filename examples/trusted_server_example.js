'use strict';

var connect = require('connect')
, log = require('winston')
, util = require('util')
, TrustedServerImplementation = require('./trusted_server_implementation_example')
;

var options = {
	log: log
};

var server = new TrustedServerImplementation(options);

connect()
	.use(server.connect(server))
	.use(function (req, res) {
		server._log('info', 'Request validated');
		res.setHeader('content-type', 'application/json');
		res.writeHead(200);
		res.end();
	}).listen(3000);

log.info('Server started\r\n--');