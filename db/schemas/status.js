var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({

	infoType: 		{type: Number, default: 0},
	address:   		String,
	information: 	[Object],
	ip:              String,
	updatedAt:  	{type: Date, default: Date.now}
});

module.exports = mongoose.model('Status', schema, 'status_t');
