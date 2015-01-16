var mongoose = require('../config');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;

var schema = new Schema({
	name:   	  String,
	loc:          Schema.Types.Mixed,
	createdAt:    {type: String, default: moment().utc('Asia/Shanghai').format()},
	updatedAt:    String,
	rooms :       [Schema.Types.ObjectId]

});

module.exports = mongoose.model('Station', schema);
