var mongoose = require('../config');
var Schema = mongoose.Schema;


/*
  address   -  中间件标识
  ip  	    -  中间件ip地址
*/
var schema = new Schema({
	 address:     String
   , ip: 		  String
});

var Address = mongoose.model('Address', schema);