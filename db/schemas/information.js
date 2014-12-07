var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({
	infoType: 		{type: Number, default: 0},
	address:   		String,
	information: 	[Object],
	createdAt:  	{type: Date, default: Date.now}
});

var Information = mongoose.model('Information', schema, 'information_t');

module.exports = Information;
