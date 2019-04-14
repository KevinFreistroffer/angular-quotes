const express = require('express');
const router = express.Router();

module.exports = function(connection) {
	router.post('/', async (req, res, next) => {
		console.log(`/saveFavoriteQuotes`, req.body.quotes);
		try {
			connection.query('SELECT * FROM QUOTES', (error, results, fields) => {
				if (error) {
					console.log(`ERROR`, error);
					return res.json({data: error});
				}

				if (results) {
					let parsedResults = JSON.parse(results);
					parsedResults.push(req.body.quotes);
					let post = JSON.stringify(parsedResults);

					connection.query('INSERT INTO quotes', post, (error, results, fields) => {
						if (error) {
							console.log(`ERROR`, error);
							return res.json({data: error});
						}

						returnres.json({ data: 'SUCCESSSSSSSSSSS' });
					})
				}
			})
		} catch(error) {
			console.log('An error occured saving the favoriate quotes', error);
			next(error);
		}
	});
};