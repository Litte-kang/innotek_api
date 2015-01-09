var mongoose = require('../config');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;

var schema = new Schema({
	firstName:   	  String,
	lastName:         String,
	userId:           String,
	hashedPassword:   String,
	ip:               String,
	lastLogin:        {type: String, default: moment().tz('Asia/Shanghai').format()},
	createdAt:        {type: String, default: moment().tz('Asia/Shanghai').format()},
	updatedAt:  	  {type: String, default: moment().tz('Asia/Shanghai').format()}
});

module.exports = mongoose.model('User', schema);
