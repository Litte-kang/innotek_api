var restify = require('restify');
var crypto = require('crypto');


var Room = require('./db/schemas/room');
var User = require('./db/schemas/user');
var Station = require('./db/schemas/station');
var Command = require('./db/schemas/command');
var Address = require('./db/schemas/address');
var State = require('./db/schemas/state');
var Curve = require('./db/schemas/curve');
var Information = require('./db/schemas/information');
var Prefer = require('./db/schemas/prefer_rooms');
var RemoteCmd = require('./remote_cmd');


var PORT = 8080;

var server = restify.createServer({
	name: 'Innotek API server',
	version: '0.0.1'
});

// var socketio = require('socket.io');
// var io = socketio.listen(server.server);

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.bodyParser());
server.use(restify.CORS());

server.listen(PORT, function(){
	console.log('%s listening at %s', server.name, server.url);
});


// io.on('connection', function(socket){
// 	socket.on('refresh store', function(data){
// 		// tell web server to update store from browser
// 		socket.broadcast.emit('update store', {store: 'update'});
// 	});
// });


/**
*
* 用户管理
*
*/

//列出所有用户
server.get('/users', function(req, res, next){
	User.find().select('_id firstName lastName userId stations').exec(function(err, data){
		if(err){
			console.log('Get users error');
			next(err);
		}else{
			res.send({users: data});
			next();
		}
	});
});


server.post('/users', createUser);
server.del('/users/:user_id', deleteUser);

server.get('/users/:user_id', function(req, res, next){
	User.findOne({_id: req.params.user_id}).select('_id userId firstName lastName stations').exec(function(err, user){
		if(err)
			next(err);
		else{
			res.send(200, {user: user});
			next();
		}

	});
});



// function getUsers(req, res, next){
// 	User.find().select('_id firstName lastName userId stations').exec(function(err, data){
// 		if(err){
// 			console.log('Get users error');
// 			next(err);
// 		}else{
// 			res.send({users: data});
// 			next();
// 		}
// 	});
// }

function createUser(req, res, next){
	//req.accepts('application/json');
	User.create({
				userId: req.body.user.userId,
				hashedPassword: generateHashedPassword('123456'),
				firstName: req.body.user.firstName,
				lastName: req.body.user.lastName
	}, function(err, user){
		if(err){
			console.log('error in create user');
			next(err);
		}
		else{
			res.status(200);
			next();
		}
	});
}



function deleteUser(req, res, next){
	console.log(req.params.user_id);
	User.remove({_id: req.params.user_id}, function(err){
		if(err){
			console.log(err);
			next(err);
		}
		else{
			res.status(200);
			next();
		}
	});
}

//用户登录, 返回该用户基本信息
function login(req, res, next){
	User.findOne({'userId': req.params.userId, 'hashedPassword': generateHashedPassword(req.params.password)})
				.select('_id userId firstName lastName  states')
				.exec(function(err, data){
						if(err){
							console.log(err);
							next(err);
						}
						else{
							console.log('Login data: ' + data);
							res.charSet('utf-8');
							res.send(200, {user: data});
							next();
						}
					}
				);
}


function generateHashedPassword(password){
	var sha = crypto.createHash('sha1');
	sha.update(password);
	return sha.digest('hex');
}



function getStatusByAddress(req, res, next){
	Status.find({address: req.params.address_id}).exec(function(err, data){
		if(err){
			console.log('Get status error');
			next(err);
		}else{
			console.log('Get status for ' + req.params.address_id + ': ' + data);
			next();
		}
	});
}

server.get('/statuses/:address_id', getStatusByAddress);




server.post('/login', login);

//Station manage
server.get('/stations', function(req, res, next){
	Station.find().exec(function(err, data){
		if(err)
			next(err);
		else{
			res.send(200, {stations: data});
			next();
		}

	})
});

server.post('/stations', function(req, res, next){

	Station.create({
				name: req.body.station.name,
				stationCode: req.body.station.stationCode,
				longitude: req.body.station.longitude,
				latitude: req.body.station.latitude
	}, function(err, station){
		if(err){
			console.log('error in create station' + err);
			next(err);
		}
		else{
			res.status(200);
			next();
		}
	});
});

server.del('/stations/:station_id', function(req, res, next){
	console.log(req.params.station_id);
	Station.remove({_id: req.params.station_id}, function(err){
		if(err){
			console.log(err);
			next(err);
		}
		else{
			res.status(200);
			next();
		}
	});
});


server.get('/states/:state_id/stations', function(req, res, next){
	State.findOne({_id: req.params.state_id}, function(err, state){
		if(err){
			next(err);
		}else{
			Station.find().where('_id').in(state.stations).exec(function(err, stations){
				if(err){
					res.send(500);
					next(err);
				}else{
					res.charSet('utf-8');
					res.send(200, {stations: stations});
					next()
				}
			});
		}
	})
});

//Save command and sent to middleware
server.post('/commands', function(req, res, next){

	var address    = req.params.address;
	var midAddress = req.params.midAddress;
	var infoType =  parseInt(req.params.infoType);

	switch(infoType){
		case 12:
			var drys;
			var wets;
			var times;
			var json;
	
			drys  = generateValues(req.params.dry);
			wets  = generateValues(req.params.wet);
			times = generateValues(req.params.sTime);
	
			json = RemoteCmd.makeConfigCurveCmd(midAddress, address, drys, wets, times);
			console.log(JSON.stringify(json));
			saveOrUpdateCommand(address, midAddress, infoType, json);
			// Command.findOneAndUpdate({address: address, midAddress: midAddress},
			// 			   {infoType: 12, address: address, midAddress: midAddress, command: json },
			// 			   {upsert: true},
			// 			   function(err, data){
			// 			   		if(err){
			// 			   			res.send(500);
			// 			   			next(err);
			// 			   		}else{
			// 			   			console.log('Curve saved success');
			// 			   			res.send(200);
			// 						next()
			// 			   		}
			// 			   });
			break;

		case 16:
			var stage = req.params.target;
			json = RemoteCmd.makeConfigCurvePhaseCmd(midAddress, address, stage);
			console.log(JSON.stringify(json));
			saveOrUpdateCommand(address, midAddress, infoType, json);
			break;
	}


});

function saveOrUpdateCommand(address, midAddress, infoType, content){
	Command.findOneAndUpdate( {address: address, midAddress: midAddress},
							  {infoType: infoType, address: address, midAddress: midAddress, command: content },
						      {upsert: true},
						   	  function(err, data){
						   	    if(err){
						   	      res.send(500);
						   		  next(err);
						   	    }else{
						   		  console.log('Curve saved success');
						   		  res.send(200);
								  next()
						   		}
						   	  }
						   	);
}


function generateValues(stringForArray){
	console.log("request string :" + stringForArray);
	var k = [];
	var lastIndex = stringForArray.lastIndexOf(',');

	if(lastIndex == stringForArray.length - 1){
		var temp = stringForArray.substring(0, lastIndex);
		temp.split(',').forEach(function(element, index, array){
			k.push(parseFloat(element));
		});
	}else{
		stringForArray.split(',').forEach(function(element, index, array){
			k.push(parseFloat(element));
		});
	}
	
	console.log("returned array: " + k[0]);
	return k;
}

function MakeConfigCurve(MidwareID, TargetID, DryBulbCurveValue, WetBulbCurveValue, TimeCurveValue)
{
	var json = 
	{
		type:12,
		address:"0",
		data:[0]
	};
	var dry_obj = {DryBulbCurve:[0]};
	var wet_obj = {WetBulbCurve:[0]};
	var time_obj = {TimeCurve:[0]};

	json.address = MidwareID;
	json.data[0] = ((TargetID >> 8) & 0x00ff);
	json.data[1] = (TargetID & 0x00ff);

	dry_obj.DryBulbCurve = DryBulbCurveValue;
	wet_obj.WetBulbCurve = WetBulbCurveValue;
	time_obj.TimeCurve = TimeCurveValue;

	json.data[2] = dry_obj;
	json.data[3] = wet_obj;
	json.data[4] = time_obj;
	
	return json;
}




server.get('/stations/:station_id/rooms', function(req, res, next){
	Station.findOne({_id: req.params.station_id}).exec(function(err, station){
		if(err){
			res.send(500);
			next(err);
		}else{
			Room.find().where('_id').in(station.rooms).exec(function(err, rooms){
				if(err){
					res.send(500);
					next(err);
				}else{
					res.send(200, {rooms: rooms});
					next()
				}
			});
		}
	})
}); 

server.get('/rooms', function(req, res, next){
	Room.find().exec(function(err, rooms){
		if(err){
			res.send(500);
			next(err);
		}else{
			res.send(200, {rooms: rooms});
			next();
		}
	})
});




server.get('/curves/:address/:midAddress', function(req, res, next){
	console.log(req.params.midAddress + " : " + req.params.address);
	Curve.findOne({midAddress: req.params.midAddress, address: req.params.address}).exec(function(err, curve){
		if(err){
			res.send(500);
			next(err);
		}else{
			res.send(200, {curve: curve});
			next();
		}
	})
});

server.get('/informations/:address/:midAddress', function(req, res, next){
	console.log('Get informations');
	Information.findOne({address: req.params.address, midAddress: req.params.midAddress, infoType: 2}).exec(function(err, information){
		if(err){
			res.send(500);
			next(err);
		}else{
			res.send(200,{info: information});
			next();
		}

	});
});

server.get('/users/:user_id/states', function(req, res, next){
	User.findOne({_id: req.params.user_id}).select('states').exec(function(err, states){
		if(err){
			res.send(500);
			next(err);
		}else{
			res.charSet('utf-8');
			res.send(200, states);
			next();
		}
	})
});

//Create prefer room
server.post('/prefer_rooms', function(req, res, next){
	console.log('Create prefer rooms');
	Prefer.create({
		 room_no:            req.params.room_no,
		 tobacco_no:         req.params.tobacco_no,
		 room_type:          req.params.room_type,
		 fan_type:           req.params.fan_type,
		 heating_equipment:  req.params.heating_equipment,
		 person_in_charge:   req.params.person_in_charge,
		 room_user:          req.params.room_user,
		 phone:              req.params.phone,
		 room_id:            req.params.room_id,
		 user_id:            req.params.user_id
	}, function(err, room){
		if(err){
			console.log('error in create prefer room' + err);
			next(err);
		}
		else{
			res.status(200);
			next();
		}
	});
});

server.get('/users/:user_id/prefers', function(req, res, next){
	Prefer.find({user_id: req.params.user_id}).exec(function(err, data){
		if(err){
			console.log('Found prefer error ' + err);
			next(err);
		}else{
			res.charSet('utf-8');
			res.send(200, {prefers: data});
			next();
		}
	})
});

//Get all middleware

server.get('/middlewares/', function(req, res, next){
	Address.find().exec(function(err, data){
		if(err){
			res.send(500);
			next(err);
		}else{
			res.charSet('utf-8');
			res.send(200, {devices: data});
			next();
		}
	});
});


server.get('/addresses', function(req, res, next){
	console.log('Fetch all addresses');
	Address.find().exec(function(err, data){
		if(err){
			res.send(500);
			next(err);
		}else{
			res.charSet('utf-8');
			res.send(200, {addresses: data});
			next();
		}
	});
});



server.get('/rooms/:room_id', function(req, res, next){
	console.log("Get room by address");
	Room.findOne({address: req.params.room_id}).exec(function(err, data){
		if(err){
			res.send(500);
			next(err);
		}else{
			res.charSet('utf-8');
			res.send(200, {room: data});
			next();
		}
	})
})



