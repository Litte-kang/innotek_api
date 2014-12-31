var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({

	name: 		String,
	code:       String, 
	ac: 		[Schema.Types.ObjectId], 
	createdAt:  {type: Date, default: Date.now}
});

module.exports = mongoose.model('room', schema);
