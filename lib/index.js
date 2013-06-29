var err = require('./errors')
, resource = require('./resource')
;

var lib = {};
Object.defineProperties(lib, {
	ResourceError: { value: err, enumerable: true },
	Resource: { value: resource, enumerable: true },
});

module.exports = lib;