const handleSignin =(db, bcrypt) => (req, res) => {
	if (!req.body.email || !req.body.password) {
		return res.status(400).json('Incorrect form submission');
	}
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('Unable to get user'))
			} else {
				res.status(400).json('Wrong credentials')
			}
		})
		.catch(err => res.status(400).json('Wrong credentials'))
}

module.exports = {
	handleSignin: handleSignin
};