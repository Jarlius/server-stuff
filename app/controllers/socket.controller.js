const model = require('../model.js');

const sendState = io => {
	io.to('').emit('state', {
		state: model.getState().state,
		player: model.getState().player,
		turn: model.getTurn(),
	});
};
const sendColor = (io,cmd,color,tiles) => {
	io.to(color).emit(cmd, {
		score: model.getScore(color),
		tiles: tiles
	});
};

module.exports = (socket, io) => {

	socket.on('created', req => {
		console.log('join', req.color);
		socket.join('');
		socket.join(model.colorToNumber(req.color));
	});
	
	socket.on('control', req => {
		console.log('control', req.color);
		
		const color = model.colorToNumber(req.color);
		model.controlButton(color);
		
		sendState(io);
		sendColor(io,'control',color,model.getBoards(color));
		sendColor(io,'control',+!color,model.getBoards(+!color));
	});
	
	socket.on('click', req => {
		console.log('click', req.number, req.color);
		
		const color = model.colorToNumber(req.color);
		const tiles = model.tileClick(req.number,color);
		
		sendState(io);
		sendColor(io,'click',color,tiles[color]);
		sendColor(io,'click',+!color,tiles[+!color]);
	});

};
