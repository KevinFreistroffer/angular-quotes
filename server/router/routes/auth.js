const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

module.exports = function(connection) {
	router.post('/', async (req, res, next) => {
		console.log(`/api/auth`, req.body);
		try {
			const body = req.body;

			connection.query('SELECT username, password from quotes', (error, results, fields) => {
				if (error) {
					console.log(`ERROR`, error);
					return res.status(500).json({ data: error });
				}

				if (!results) {
					// JWT token validate

					// if error
					// show message invalid login
 
					// otherwise show successfull login message and route to dashboard
					return res.status(401).json({ data: 'not authorized'});
				} else if (results.username === body.username && results.password === body.password) {
					const token = jwt.sign({userID: results.username}, 'super-secret-secret', {expiresIn: '2h'});

					res.status(200).json({data: token});
				}
			})
		} catch(error) {
			console.log('An error occured saving the favoriate quotes', error);
			next(error);
		}
	});
};