var state = 'start';
var size = 9;

var blue_board = [];
var red_board = [];

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
exports.nextState = color => {
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

exports.tileClick = tile => {
	if (state !== 'blueturn' && state !== 'redturn')
		return {number: 0, color: 0};
	
	const new_tile = {number: tile.number, color: 1};
	
	if (tile.color === 'blue')
		blue_board.push(new_tile);
	else
		red_board.push(new_tile);
	return new_tile;
};
