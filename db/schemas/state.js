var mongoose = require('../config');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;

var schema = new Schema({
	name:   	  String,
	code:         String,
	createdAt:    {type: String, default: moment().utc('Asia/Shanghai').format()},
	updatedAt:    String,
	stations :    [Schema.Types.ObjectId]

});

module.exports = mongoose.model('State', schema);
