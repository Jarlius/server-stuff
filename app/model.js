var state = 'start';
var size = 9;

var blue_board = [];
var red_board = [];

/**
 * Read only get functions for model variables
 */
exports.getState = () => {return state;};
exports.getSize = () => {return size;};

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
		
	if (tile.color == 'blue')
		blue_board.push(tile);
	else
		red_board.push(tile);
	return {number: tile.number, color: 1};
};
