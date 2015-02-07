var mongoose = require('../config');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;

var schema = new Schema({
     infoType:      {type: Number, default: 0}
   , address:       String
   , midAddress:    String
   , ip: 			String
   , isBelow:      {type: Number, default: 0}	//上下棚标识  0标识上棚  1标识下棚， 默认为0
   , updatedAt:    String
   , status:       [Number]
});

module.exports = mongoose.model('Room', schema);

