var state = 'start';

/**
 * Get the state of the battleship model, and whether the player should show the board
 */
exports.getState = color => {
	return {state: state, show: true};
}
