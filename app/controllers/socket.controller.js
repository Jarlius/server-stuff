const model = require('../model.js');

module.exports = (socket, io) => {

	socket.on('created', req => {
		console.log('join', req.color);
		socket.join('');
	});
	
	socket.on('control', req => {
		console.log('control', req.color);
		model.controlButton(req.color);
		io.to('').emit('control', {
			state: model.getState(),
			score: model.getScore(req.color),
			boards: model.getBoards(req.color)
		});
	});

};
