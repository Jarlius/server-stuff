const model = require('../model.js');

module.exports = (socket, io) => {

	socket.on('test', req => {
		console.log('testping');
	});

};
