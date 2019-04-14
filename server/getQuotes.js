const express = require('express');
const router = express.Router();

module.exports = function(app, connection) {
	router.get('/', async (req, res, next) => {
		try {
			connection.query('SELECT * FROM myQuotes', (error, results, fields) => {
			  console.log(error, results, fields);

			  return res.json({ data: results });
			});
		} catch(error) {
			console.log(`An error occured saving a favoriate quote`);
			next(error);
		}
	});
}