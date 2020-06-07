var score = [];

/**
 * Reset a ship's score to specified amount
 */
exports.reset = (ship_specs, colors) => {
	for (var i in colors) {
		score[colors[i]] = [];
		for (var j in ship_specs)
			score[colors[i]][j] = ship_specs[j].slice();
	}
};

/**
 * Get a ship's score
 */
exports.get = color => {
	return score[color];
};

/**
 * Check if the count on all ship lengths are zero
 */
exports.isZero = color => {
	for (var i in score[color])
		if (score[color][i][1] !== 0)
			return false;
	return true;
};

/**
 * Change current score by 1/-1, when a ship is deleted/added
 * Impossible if the length is bad/already used
 */
exports.edit = (color, length, increment) => {
	for (var i in score[color])
		if (score[color][i][0] === length) {
			if (score[color][i][1] + increment >= 0) {
				score[color][i][1] += increment;
				return true;
			} else
				return false;
		}
	return false;
};
