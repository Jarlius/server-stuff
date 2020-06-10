var state = 'start';
var player = 0;

/**
 * Read-only copy
 */
exports.get = () => {
	return {state: state, player: player};
};

/**
 * Change the program state into its next state
 */
exports.next = () => {
	switch (state) {
	case 'start':
		state = 'prep';
		player = 0;
		break;
	case 'prep':
		if (player)
			state = 'turnplay';
		player = +!player;
		break;
	case 'turnplay':
		state = 'turnend';
		break;
	case 'turnend':
		state = 'turnplay';
		player = +!player;
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
exports.gameover = () => {
	state = 'gameover';
};
