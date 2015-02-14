var Room = require('./db/schemas/room');
var Station = require('./db/schemas/station');
var State = require('./db/schemas/state');
var User = require('./db/schemas/user');


Room.find().select("_id").exec(function(err, data){
	console.log(data);
	Station.findOneAndUpdate({code: "1001001"}, {rooms: data}, function(err, station){
		if(err)
			console.log(err);
		else
			console.log(station);
	});
});

Station.find().select('_id').exec(function(err, data){
	console.log('Stations id: ' + data);
	State.findOneAndUpdate({code: '1001'}, {stations: data}, function(err, state){
		if(err)
			console.log(err);
		else
			console.log(state);
	})
});

State.find().select('_id name').exec(function(err, data){
	console.log('_id:' + data._id + ' and name: ' + data.name);

	User.findOneAndUpdate({userId: '160386'},  {states: data}, function(err, user){
		if(err)
			console.log(err);
		else
			console.log(user);
	})
});

State.

