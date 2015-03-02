var crypto = require('crypto');
var User = require('./db/schemas/user');




		
	User.create({
					userId: '100000',
					hashedPassword: generateHashedPassword('123456'),
					firstName: 'Bob',
					lastName: 'Zhang',
					
		}, function(err, user){
				if(err)
					console.log(err);
				else
					console.log(user);
		});

	




function generateHashedPassword(password){
	var sha = crypto.createHash('sha1');
	sha.update(password);
	return sha.digest('hex');
}
