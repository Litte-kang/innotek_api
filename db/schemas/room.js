var mongoose = require('../config');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;

var schema = new Schema({
     infoType:      {type: Number, default: 0}
   , address:       String
   , midAddress:    String
   , ip: 			String
   , isBelow:       Number
   , updatedAt:     String
   , status:       [Number]
});

module.exports = mongoose.model('Room', schema);

