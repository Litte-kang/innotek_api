var mongoose = require('../config');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;

var schema = new Schema({
	name:   	  String,
	stationCode:  String,
	longitude:    Number,
	latitude:     Number,
	createdAt:    {type: String, default: moment().utc('Asia/Shanghai').format()},
	updatedAt:    String,
	rooms :       [Schema.Types.Mixed]

});

module.exports = mongoose.model('Station', schema);
