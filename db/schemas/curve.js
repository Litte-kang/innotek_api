var mongoose = require('../config');
var Schema = mongoose.Schema;

var schema = new Schema({
	address:      String,
	midAddress:   String,
	infoType:     Number,
	curves:       [Schema.Types.Mixed] 

});

module.exports = mongoose.model('Curve', schema);