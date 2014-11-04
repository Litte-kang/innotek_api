var restify = require('restify');
var Information = require('./db/schemas/information');
var Status = require('./db/schemas/status');
var PORT = 8080;

var server = restify.createServer({
	name: 'Innotek API server',
	version: '1.0.0'
});


server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.bodyParser());

server.listen(PORT, function(){
	console.log('%s listening at %s', server.name, server.url);
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

function getStatus(req, res, next){
	Status.find().exec(function(err, data){
		if(err){
			console.log('Get status error');
			next(err);
		}else{
			res.send(data);
			next();
		}
	});
}

server.get('/informations', getInformations);
server.get('/informations/types/:type_id', getLastInformationsByType);

server.get('/status', getStatus);