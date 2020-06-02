require('better-logging')(console);

const path = require('path');
const express = require('express');

module.exports = () => {
	const app = express();

	// Setup express
	app.use((req, res, next) => {
		// Logs each incoming request
		console.info(`${req.ip} ${req.path} ${req.body || ''}`);
		next();
	});
	app.use(
		// Declare public directory, starting with index.html
		express.static(path.join(__dirname, '..', '..', 'public'))
		// express.static(absolutePathToPublicDirectory)
	);

	return {
		app
	}
};
