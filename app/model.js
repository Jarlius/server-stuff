const coordinate = require('./models/coordinate.model.js');

var state = 'start';
var size = 9;

var blue_board = [];
var red_board = [];

var last_move = coordinate(0,size);

/**
 * Read only get functions for model variables
 */
exports.getState = () => {return state;};
exports.getSize = () => {return size;};
exports.getBoards = color => {
/*	if (color === 'blue')
		return blue_board;
	else
		return red_board;
*/	return {blue: blue_board, red: red_board};
};

/**
 * Try to change the program state into its next state
 */
nextState = color => {
	switch (state) {
	case 'start':
//		state = 'blueprep';
		state = 'blueturn';
		break;
	case 'blueturn':
		state = 'blueend';
		break;
	case 'blueend':
		state = 'redturn';
		break;
	case 'redturn':
		state = 'redend';
		break;
	case 'redend':
		state = 'blueturn';
		break;
	default:
		break;
	}
	return state;
};
exports.nextState = nextState;

const prepare = tile => {
	
}

const takeTurn = tile => {
	var new_tile = {number: tile.number, color: 1};
	
	if (state === 'blueturn' && tile.color === 'blue')
		blue_board.push(new_tile);
	else if (state === 'redturn' && tile.color === 'red')
		red_board.push(new_tile);
	else {
		new_tile = {number: 0, color: 0};
		if (state !== 'blueend' && state !== 'redend')
			return new_tile;
	}
	nextState(tile.color);
	return new_tile;
}

exports.tileClick = tile => {
	if (state === 'blueprep' || state === 'redprep')
		return prepare(tile);
	else
		return takeTurn(tile);
};
