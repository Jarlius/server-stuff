var state = 'start';
var color = 0;

/**
 * Read-only copy
 */
exports.get = () => {
	return {state: state, color: color};
};

/**
 * Change the program state into its next state
 */
exports.next = () => {
	switch (state) {
	case 'start':
		state = 'prep';
		color = 0;
		break;
	case 'prep':
		if (color)
			state = 'turnplay';
		color = +!color;
		break;
	case 'turnplay':
		state = 'turnend';
		break;
	case 'turnend':
		state = 'turnplay';
		color = +!color;
		break;
	case 'gameover':
		state = 'start';
		break;
	default:
		break;
	}
	return state;
};

/**
 * Force the state into a gameover state
 */
exports.win = () => {
	state = 'gameover';
};
