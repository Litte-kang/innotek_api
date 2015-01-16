var restify = require('restify');
var crypto = require('crypto');

var Information = require('./db/schemas/information');
var Room = require('./db/schemas/room');
var User = require('./db/schemas/user');
var Station = require('./db/schemas/station');



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

//测试阶段，只监控6自控仪
function getStatuses(req, res, next){
	Status.find().limit(6).exec(function(err, data){
		if(err){
			
			next(err);
		}else{
			
			res.send({statuses: data});
			next();
		}
	});
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
	User.find().select('_id firstName lastName userId').exec(function(err, data){
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
				.select('_id firstName lastName userId')
				.exec(function(err, data){
							if(err){
								console.log(err);
								next(err);
							}
							else{
								console.log('Login data: ' + data);
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

server.get('/statuses', getStatuses); 
server.get('/statuses/:address_id', getStatusByAddress);

server.get('/users', getUsers);
server.post('/users', createUser);
server.del('/users/:user_id', deleteUser);


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



