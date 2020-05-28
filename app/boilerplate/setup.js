const express = require('express');
const path = require('path');

module.exports = () => {
	const app = express();
	
	// Declare public directory, starting with index.html
	app.use(
		express.static(path.join(__dirname, '..', '..', 'public'))
		// express.static(absolutePathToPublicDirectory)
	);

	return {
		app
	}
};
