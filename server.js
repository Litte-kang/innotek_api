var restify = require('restify');
var Information = require('./db/schemas/information');
var Status = require('./db/schemas/status');
var PORT = 8080;

var server = restify.createServer({
	name: 'Innotek API server',
	version: '0.0.1'
});


server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.bodyParser());
//server.use(restify.CORS());
//server.use(restify.fullResponse());

server.use(
  function crossOrigin(req,res,next){
  	res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

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

function getStatuses(req, res, next){
	Status.find().exec(function(err, data){
		if(err){
			console.log('Get status error');
			next(err);
		}else{
			console.log('Get status ' + data);
			res.send({statuses: data});
			next();
		}
	});
}

server.get('/informations', getInformations);
server.get('/informations/types/:type_id', getLastInformationsByType);

server.get('/statuses', getStatuses);