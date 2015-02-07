var restify = require('restify');
var crypto = require('crypto');


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

	var address    = req.params.address;
	var midAddress = req.params.midAddress;
	var ip;
	var drys;
	var wets;
	var times;
	var json;
	
	console.log('Address is ' + address + ' and MidAddress is ' + midAddress); 
	Address.findOne({address: midAddress}).exec(function(err, data){
		console.log('Address is ' + data.ip);
		if(err){
			next(err);
		}else{
			Room.findOne({address: address, midAddress: midAddress}).exec(function(err, room){
				if(err)
					next(err);
				else{
					console.log('Address updatedAt is ' + data.updatedAt);
					console.log('Room upatedAt is' + room.updatedAt);
				    if(data.updatedAt > new Date(room.updatedAt)){
				    	ip = data.ip;
				    }else
				    	ip = room.ip;
					console.log('IP is ' + ip);
					

					drys  = generateValues(req.params.dry);
					wets  = generateValues(req.params.wet);
					times = generateValues(req.params.sTime);

					json = MakeConfigCurve(midAddress, address, drys, wets, times);
					console.log('Data is ' + JSON.stringify(json));
					client.SendCmdInfo(8125, ip, JSON.stringify(json));
					res.send(200);
					next();
				}
			})
		}
	});
});

function generateValues(stringForArray){
	console.log(stringForArray);
	var array = [];
	var lastIndex = stringForArray.lastIndexOf(',');

	if(lastIndex == stringForArray.length -1){
		var temp = stringForArray.substring(0, lastIndex - 1);
		console.log('Temp is ' + temp);
		temp.split(',').forEach(function(element, index, array){
			array.push(parseFloat(element));
		});
	}else{
		stringForArray.split(',').forEach(function(element, index, array){
			array.push(parseFloat(element));
		});
	}
	
	console.log(array[0]);
	return array;
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
})



