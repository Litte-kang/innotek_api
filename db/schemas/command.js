var mongoose = require('../config');

var Schema = mongoose.Schema;

var schema = new Schema({

	infoType: 		{type: Number, default: 12},
	address:   		String,
	midAddress:     String,
	command: 	    Schema.Types.Mixed,
	createdAt:  	{type: Date, default: Date.now}
});

module.exports = mongoose.model('Command', schema);

// module.exports.AddCommand = function(options, doc){

// 	Command.findOneAndUpdate(options, doc, {upsert: true}, function(err, data){
						   
//    		if(err){
//    			console.log('command saved failed');
//    			res.send(500);
//    			next(err);
//    		}else{
//    			console.log('command saved success');
//    			res.send(200);
// 			next()
//    		}
// 	});	
// };
