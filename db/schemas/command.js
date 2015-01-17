var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({

	infoType: 		{type: Number, default: 0},
	address:   		String,
	command: 	    [Schema.Types.Mixed],
	ip:             String,
	createdAt:  	{type: Date, default: Date.now}
});

module.exports = mongoose.model('Command', schema);
