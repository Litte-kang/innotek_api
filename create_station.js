var Station = require('./db/schemas/station');

var stations = [
	{name:'浏阳烟站', longitude: 113.611314, latitude: 28.183031},
	{name:'郴州烟站', longitude: 112.978057, latitude: 25.783565},
	{name:'株洲烟站', longitude: 113.086133, latitude: 27.778352},
	{name:'茶陵烟站', longitude: 113.63739, latitude: 26.803633}
];

for(var station in stations){
	Station.create({
	name: station.name,
	longitude: station.longitude,
	latitude: station.latitude,
	}, function(err, user){
		if(err)
			console.log(err);
		else
			console.log(user);
	});
}


