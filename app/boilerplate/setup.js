require('better-logging')(console);

const path = require('path');
const express = require('express');

const http = require('http');
const socket_io = require('socket.io');

module.exports = () => {
	const app = express();

	// Setup express
	app.use((req, res, next) => {
		// Logs each incoming request
		console.info(`${req.ip} ${req.path} ${req.body || ''}`);
		next();
	});
	app.use(express.json() /*
		This is a middleware, provided by express, that parses the 
		body of the request into a javascript object.
		It's basically just replacing the body property like this:
		req.body = JSON.parse(req.body)
	*/);
	app.use(
		// Declare public directory, starting with index.html
		express.static(path.join(__dirname, '..', '..', 'public'))
		// express.static(absolutePathToPublicDirectory)
	);

	// listening on this httpServer will automatically send
	// socket information on url:port/socket.io/socket.io.js
	const httpServer = http.Server(app);
	const io = socket_io.listen(httpServer);

	return {
		app, io, httpServer
	}
};
