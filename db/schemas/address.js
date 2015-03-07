var mongoose = require('../config');
var Schema = mongoose.Schema;

var schema = new Schema({
	 address:     String
   , ip: 		  String
   , updatedAt:   Date
   , data:        [Schema.Types.Mixed]
});

module.exports = mongoose.model('Address', schema);
