const model = require('../model.js');

module.exports = (socket, io) => {

	socket.on('created', req => {
		console.log(req.msg);
		socket.join('');
		io.to('').emit('created', {msg: 'testresponse'});
	});
	
	socket.on('control', req => {
		console.log('control', req.color);
		model.controlButton(req.color);
		io.to('').emit('control', {state: model.getState()});
	});

};
