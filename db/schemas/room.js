var mongoose = require('../config');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;

var schema = new Schema({
     infoType:     {type: Number, default: 0}
   , address:       String
   , ip:            String
   , status:       [Number]
   , updatedAt:    String
});

module.exports = mongoose.model('Room', schema);

