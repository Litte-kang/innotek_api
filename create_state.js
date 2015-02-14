var State = require('./db/schemas/state');


var states = [
	{name:'浏阳', code: '1001'},
	{name:'郴州', code: '1002'},
	{name:'株洲', code: '1003'},
	{name:'茶陵', code: '1004'}
];

for(var i =0; i < states.length ; i++){
	State.create({
		name: states[i].name,
		code: states[i].code,
	}, function(err, station){
		if(err)
			console.log(err);
		else
			console.log(station);
	});
}

