const model = require('../model.js');

module.exports = (socket, io) => {

	socket.on('created', req => {
		console.log('join', req.color);
		socket.join('');
		socket.join(req.color);
	});
	
	socket.on('control', req => {
		console.log('control', req.color);
		
		const color = model.colorToNumber(req.color);
		model.controlButton(color);
		
		io.to('').emit('control-all', {
			state: model.getState().state,
			player: model.getState().player,
			turn: model.getTurn(),
			boards: model.getBoards(color)
		});
		io.to(req.color).emit('control-color', {
			score: model.getScore(color),
		});
	});
	
	socket.on('click', req => {
		console.log('click', req.number, req.color);
		
		const color = model.colorToNumber(req.color);
		const tiles = model.tileClick(req);
		
		io.to('').emit('click-all', {
			state: model.getState().state,
			player: model.getState().player,
			turn: model.getTurn(),
			tiles: tiles[color]
		});
		io.to(req.color).emit('click-color', {
			score: model.getScore(color),
		});
	});

};
