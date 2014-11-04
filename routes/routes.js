var Information = require('../db/schemas/information');
var server = require('../server');

function getInformations(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X');

	Information.find().sort('created_at').execFind(function(err, data){
		res.send(data);
	});
	next();
}

server.get('/informations', getInformations);


