const express = require('express');
const router = express.Router();
const saveFavoriteQuotes = require('./routes/saveFavoriteQuotes'); 


module.exports = function(app, connection) {
	app.use('/api/saveFavoriteQuotes', saveFavoriteQuotes)(connection);
};