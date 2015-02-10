var crypto = require('crypto');
var User = require('./db/schemas/user');
var Station  = require('./db/schemas/station');

Station.find().select("_id name").exec(function(err, stations){
	
	if(!err){
		
		var array = [];
		for(var i=0; i<stations.length; i++){
			array.push({
				_id: stations[i]._id,
				name: stations[i].name
			});
		}

		console.log(array);
				User.create({
					userId: '160386',
					hashedPassword: generateHashedPassword('123456'),
					firstName: 'Jay',
					lastName: 'King',
					stations: array
		}, function(err, user){
				if(err)
					console.log(err);
				else
					console.log(user);
		});
	}else{
		console.log('Create user err ' + err);
	}
	
});



function generateHashedPassword(password){
	var sha = crypto.createHash('sha1');
	sha.update(password);
	return sha.digest('hex');
}
