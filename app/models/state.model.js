var state = 'start';

/**
 * Read-only copy
 */
exports.get = () => {
	return state;
};

/**
 * Change the program state into its next state
 */
exports.next = () => {
	switch (state) {
	case 'start':
		state = 'blueprep';
		break;
	case 'blueprep':
		state = 'redprep';
		break;
	case 'redprep':
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
	case 'bluewin':
		state = 'start';
		break;
	case 'redwin':
		state = 'start';
		break;
	default:
		break;
	}
	return state;
};

/**
 * Force the state into a win state
 */
exports.win = color => {
	if (color)
		state = 'redwin';
	else
		state = 'bluewin';
};
