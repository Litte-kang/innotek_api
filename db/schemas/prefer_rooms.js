var mongoose = require('../config');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;

var schema = new Schema({
	room_no:               String,     					//烤房编号
	tobacco_no: 	       String,                      //烟基号
	room_type:             String,						//烤房类型
	fan_type:              String,						//风机型号
	heating_equipment:     String,						//升温设备
	person_in_charge:      String, 						//责任人
	room_user:             String,						//使用烟农
	phone:                 String,						
	createdAt:             {type: String, default: moment().utc('Asia/Shanghai').format()},
	updatedAt:             String,
	room_id:               Schema.Types.ObjectId,     //自控仪编号
	user_id:               Schema.Types.ObjectId
});

module.exports = mongoose.model('PreferRoom', schema);