const setupBoilerplate = require('./boilerplate/setup.js');

const { app, io, listen } = setupBoilerplate();
const port = 8989;

// use /api for REST router, to not interfere with regular urls (may be changed)
const router = require('./controllers/api/rest.controller.js');
app.use('/api', router);

// Pair up socket controller with the socket io url
const socketController = require('./controllers/api/socket.controller.js');
io.on('connection', socket => {
	socketController(socket, io);
});

// listening using this function lets both the app and io use the same port
listen(port, () => {
	console.log("server listening on port", port);
});
