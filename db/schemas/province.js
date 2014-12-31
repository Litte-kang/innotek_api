var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({

	name: 			String,
	states: 	    [Schema.Types.Mixed],
	updatedAt:  	{type: Date, default: Date.now}
});

module.exports = mongoose.model('province', schema);
