var restify = require('restify');
var crypto = require('crypto');

var Information = require('./db/schemas/information');
var Room = require('./db/schemas/room');
var User = require('./db/schemas/user');
var Station = require('./db/schemas/station');
var Command = require('./db/schemas/command');
var Address = require('./db/schemas/address');

var client = require('./client');

var PORT = 8080;

var server = restify.createServer({
	name: 'Innotek API server',
	version: '0.0.1'
});

var socketio = require('socket.io');
var io = socketio.listen(server.server);

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.bodyParser());
server.use(restify.CORS());

server.listen(PORT, function(){
	console.log('%s listening at %s', server.name, server.url);
});


io.on('connection', function(socket){
	socket.on('refresh store', function(data){
		// tell web server to update store from browser
		socket.broadcast.emit('update store', {store: 'update'});
	});
});


function getInformations(req, res, next){
	Information.find().sort('-created_at').exec(function(err, data){
		if(err){
			console.log('ERROR');
			next(err);
		}
		else
			res.send(data);
			next();
	});

}

function getLastInformationsByType(req, res, next){
	Information.find({info_type: req.params.type_id}).exec(function(err, data){
		if(err){
			console.log('ERROR');
			next(err);
		}else{
			res.send(data);
			next();
		}
	})
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

function getUsers(req, res, next){
	User.find().select('_id firstName lastName userId stations').exec(function(err, data){
		if(err){
			console.log('Get users error');
			next(err);
		}else{
			res.send({users: data});
			next();
		}
	});
}

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

function login(req, res, next){
	console.log('Get a login request userId: ' + req.params.userId + " and password is: " + req.params.password);

	User.findOne({'userId': req.params.userId, 'hashedPassword': generateHashedPassword(req.params.password)})
				.select('_id firstName lastName userId stations')
				.exec(function(err, data){
							if(err){
								console.log(err);
								next(err);
							}
							else{
								console.log('Login data: ' + data);
								res.charSet('utf-8');
								res.send(200,{user: data});
								next();
							}

	});
}

function generateHashedPassword(password){
	var sha = crypto.createHash('sha1');
	sha.update(password);
	return sha.digest('hex');
}

server.get('/informations', getInformations);
server.get('/informations/types/:type_id', getLastInformationsByType);


server.get('/statuses/:address_id', getStatusByAddress);

server.get('/users', getUsers);
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


//Save command and sent to middleware
server.post('/commands', function(req, res, next){
	console.log('Send command');
	Room.find().exec(function(err, data){
		if(err){
			next(err);
		}else{
			console.log('dd' + data[0].updatedAt);
			res.send(200, {status: 'ok'});
			next();
		}

	})


	//var midAddress  = req.params.midAddress;
	//var address = req.params.address;
	// var dry = req.params.dry;
	// var wet = req.params.wet;
	// var time = req.params.sTime;
	// var ip = req.params.ip;

	// console.log(midAddress);

	// Address.findOne({address: req.params.midAddress}).exec(function(err, address){
	// 	if(err){
	// 		console.log(err);
	// 		next(err);
	// 	}else{
	// 		console.log(address.updatedAt);
	// 		res.send(200, {status: ok});
	// 		next();
	// 	}
			
	// })

	// var drys = [];
	// dry.split(',').forEach(function(element, index, array){
	// 	drys.push(parseFloat(element));
	// });
	// drys.pop();
	// console.log(drys);

	// var wets = [];
	// wet.split(',').forEach(function(element, index, array){
	// 	wets.push(parseFloat(element));
	// });
	// wets.pop()
	// console.log(wets);

	// var times = [];
	// time.split(',').forEach(function(element, index, array){
	// 	times.push(parseFloat(element));
	// });
	// times.pop();
 //    console.log(times);

	// var json = MakeConfigCurve(midAddress, address, drys, wets, times);
	
	// console.log(JSON.stringify(json));
	// //var string = '{"type":12,"address":"0000000002","data":[0,100,{"DryBulbCurve":[30,31,32,33,34,35,36,37,38,39]},{"WetBulbCurve":[40.5,41.5,42,43,44,45,46,47,48,49]},{"TimeCurve":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]}]}';
	// client.SendCmdInfo(8125, ip, JSON.stringify(json));

	// res.send(200,"ok");

	// next();

});



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
})



