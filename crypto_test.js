var crypto = require('crypto');

var shasum = crypto.createHash('sha1');
shasum.update('123456');
var d = shasum.digest('hex');
console.log(d);