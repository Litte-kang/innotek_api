var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({

	info_type: 		{type: Number, default: 0},
	address:   		String,
	information: 	[Number],
	updated_at:  	{type: Date, default: Date.now}
});

module.exports = mongoose.model('Status', schema);
