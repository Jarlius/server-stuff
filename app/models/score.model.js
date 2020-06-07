var score = [];

exports.init = (ship_specs, color) => {
	score[color] = [];
	for (var i in ship_specs)
		score[color][i] = ship_specs[i].slice();
};

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
