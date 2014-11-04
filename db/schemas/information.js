var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({
	device_id: 		String,
	info_type: 		{type: Number, default: 0},
	address:   		String,
	information: 	[Number],
	created_at:  	{type: Date, default: Date.now}
});

var Information = mongoose.model('Information', schema);

module.exports = Information;
