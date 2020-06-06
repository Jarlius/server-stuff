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
	
	socket.on('click', req => {
		console.log('click', req.number, req.color);
		const tiles = model.tileClick(req);
		io.to('').emit('click', {
			state: model.getState(),
			score: model.getScore(req.color),
			tiles: tiles
		});
	});

};
