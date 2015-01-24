var crypto = require('crypto');
var User = require('./db/schemas/user');

User.create({
	userId: '160386',
	hashedPassword: generateHashedPassword('123456'),
	firstName: 'Jay',
	lastName: 'King',
	stations: [
		{
			_id: '54bd18104e38d8d7048aea8a',
			name: '郴州烟站'
		},
		{
			_id: '54c290999c8b7c9e04abd65d',
			name: '茶陵烟站'
		}
	]
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
