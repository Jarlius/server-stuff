var ships = [];

/**
 * Reset to remove undestroyed ship at end of game
 */
exports.reset = colors => {
	for (var i in colors)
		ships[colors[i]] = [];
};

/**
 * Checks if a new ship will obstruct any old ship
 * Returns obstructing ship if bad, false if good
 */
exports.badShip = (ship,color) => {
	for (var i in ships[color])
		if (ship.obstructs(ships[color][i]))
			return ships[color][i];
	return false;
};
/**
 * Add a ship to the list of built ships
 */
exports.addShip = (ship,color) => {
	ships[color].push(ship);
};
/**
 * Detelete a target ship
 * If not in preparation, check if end of game when 0 ships left
 */
exports.delShip = (ship,color) => {
	for (var i in ships[color]) {
		if (ship.equals(ships[color][i])) {
			ships[color].splice(i,1);
			return (ships[color].length === 0);
		}
	}
	return false;
};

