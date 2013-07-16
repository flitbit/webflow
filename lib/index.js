var err    = require('./errors')
, success  = require('./success')
, resource = require('./resource')
, trusted  = require('./trusted_client')
;

var lib = {};
Object.defineProperties(lib, {
  Success:       { value: success, enumerable: true },
  ResourceError: { value: err, enumerable: true },
  Resource:      { value: resource, enumerable: true },
  TrustedClient: { value: trusted, enumerable: true },
});

module.exports = lib;