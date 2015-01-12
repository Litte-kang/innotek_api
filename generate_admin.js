var crypto = require('crypto');
var User = require('./db/schemas/user');

User.create({
	userId: 'admin',
	hashedPassword: generateHashedPassword('123456'),
	firstName: 'Liu',
	lastName: 'David'
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
