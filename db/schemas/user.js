var mongoose = require('../config');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;

var schema = new Schema({
	firstName:   	  String,
	lastName:         String,
	userId:           String,
	hashedPassword:   String,
	ip:               String,
	lastLogin:        String,
	createdAt:        {type: String, default: moment().utc('Asia/Shanghai').format()},
	updatedAt:  	  {type: String, default: moment().utc('Asia/Shanghai').format()}
});

module.exports = mongoose.model('User', schema);
