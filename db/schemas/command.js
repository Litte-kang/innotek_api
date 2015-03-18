var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({

	infoType: 		{type: Number, default: 12},
	address:   		String,
	midAddress:     String,
	curves: 	    Schema.Types.Mixed,
	createdAt:  	{type: Date, default: Date.now}
});

module.exports = mongoose.model('Command', schema);
