var state = 'start';

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
		state = 'blueprep';
		break;
	default:
		break;
	}
	return {state: state, show: (color === 'blue')};
};
