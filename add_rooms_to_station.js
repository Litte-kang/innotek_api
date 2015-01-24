var Room = require('./db/schemas/room');
var Station = require('./db/schemas/station');

Room.find().select("_id").exec(function(err, data){
	console.log(data);
	Station.findOneAndUpdate({stationCode: "1004"}, {rooms: data}, function(err, data){
		if(err)
			console.log(err);
		else
			console.log(data);
	});
})