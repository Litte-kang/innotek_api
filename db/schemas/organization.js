var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({

	province: 		String,
	states: 	    [Schema.Types.Mixed],
	createdAt:  	{type: Date, default: Date.now}
});

module.exports = mongoose.model('organization', schema);
