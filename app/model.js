var state = 'start';

var blue_board = [];
var red_board = [];

/**
 * Get the state of the battleship model, and whether the player should show the board
 */
exports.getState = color => {
	return {state: state, show: 
		(state === 'start')
	};
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
	return {state: state};
};
