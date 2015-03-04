var mongoose = require('../config');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;

var schema = new Schema({
	room_no:   	           String,
	room_type:             String,
	fan_type:              String,
	heating_equipment:     String,
	person_in_charge:      String,
	room_user:             String,
	phone:                 String,
	createdAt:             {type: String, default: moment().utc('Asia/Shanghai').format()},
	updatedAt:             String,
	room_id:               Schema.Types.ObjectId,
	user_id:               Schema.Types.ObjectId
});

module.exports = mongoose.model('PreferRoom', schema);