var Station = require('./db/schemas/station');

var Stations = [
	{name:'永和村烟站', code: '1001001', longitude: 113.611314, latitude: 28.183031}
];

for(var i =0; i < Stations.length ; i++){
	Station.create({
		name: Stations[i].name,
		code: Stations[i].code,
		longitude: Stations[i].longitude,
		latitude: Stations[i].latitude,
	}, function(err, station){
		if(err)
			console.log(err);
		else
			console.log(station);
	});
}


