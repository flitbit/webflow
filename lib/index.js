var err    = require('./errors')
, success  = require('./success')
, resource = require('./resource')
;

var lib = {};
Object.defineProperties(lib, {
  Success:       { value: success, enumerable: true },
  ResourceError: { value: err, enumerable: true },
  Resource:      { value: resource, enumerable: true },
});

module.exports = lib;