'use strict';

module.exports._log = function _log(log, level, msg, data) {
	if (log) {
		if ('undefined' === typeof data) {
			data = '';
		}
		log[level](msg, data);
	}
};

var __sequence = 0;

function padL(n, len) {
	// JSLINT doesn't like the next line but we're purposely initializing the len.
	// ...there should be some JSLINT options that remove the warning but I don't know
	//    what they are.
	return (new Array(len - String(n).length + 1)).join("0").concat(n);
};

module.exports.sequence = function sequence(seq) {
	return padL(__sequence++, 10);
};