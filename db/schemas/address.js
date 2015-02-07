var mongoose = require('../config');
var Schema = mongoose.Schema;

var schema = new Schema({
	 address:     String
   , ip: 		  String
   , updatedAt:   Date
});

module.exports = mongoose.model('Address', schema);
