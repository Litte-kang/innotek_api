var mongoose = require('../config');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;

var schema = new Schema({
	firstName:   	  String,
	lastName:         String,
	userId:           String,
	hashedPassword:   String,
	ip:               String,
	isAdmin:          {type: Boolean, default: false},
	lastLogin:        String,
	createdAt:        {type: String, default: moment().utc('Asia/Shanghai').format()},
	updatedAt:  	  String
});

module.exports = mongoose.model('User', schema);
