var crypto = require('crypto');

var shasum = crypto.createHash('sha1');
shasum.update('nihaoccj123');
var d = shasum.digest('hex');
console.log(d);