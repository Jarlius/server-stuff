const Coordinate = require('./models/coordinate.model.js');
const Ship = require('./models/ship.model.js');

const size = 9;
const ship_specs = [[2,1],[3,2],[4,1],[5,1]];

var state = 'start';

var ships = [];
ships['blue'] = [];
ships['red'] = [];

var score = [];
score['blue'] = [];
score['red'] = [];
const scoreInit = color => {
	for (var i in ship_specs)
		score[color][i] = ship_specs[i].slice();
};
scoreInit('blue');
scoreInit('red');
const checkScoreZero = color => {
	for (var i in ship_specs)
		if (score[color][i][1] !== 0)
			return false;
	return true;
};

var board = [];
board['blue'] = [];
board['red'] = [];

var last_move = null;

/**
 * Read only get functions for model variables
 */
exports.getState = () => {return state;};
exports.getSize = () => {return size;};
exports.getScore = color => {return score[color];};
exports.getBoards = color => {
/*	if (color === 'blue')
		return {blue: board['blue'], red: []};
	else
		return {blue: [], red: board['red']};
*/	return {blue: board['blue'], red: board['red']};
};

/**
 * Change the program state into its next state
 */
const nextState = () => {
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
 * Control flow for a button press
 * Initialises arrays and changes states
 */
exports.controlButton = color => {
	switch (state) {
	case 'start':
		board['blue'] = Array(size*size).fill(0);
		break;
	case 'blueprep':
		if (color !== 'blue' || !checkScoreZero('blue'))
			return;
		board['blue'] = Array(size*size).fill(0);
		board['red'] = Array(size*size).fill(0);
		break;
	case 'redprep':
		if (color !== 'red' || !checkScoreZero('red'))
			return;
		board['red'] = Array(size*size).fill(0);
		break;
	default:
		break;
	}
	nextState();
};

/**
 * Change current score by 1/-1, when a ship is deleted/added
 * Impossible if the length is bad/already used
 */
const editScore = (color, length, increment) => {
	for (var i in ship_specs)
		if (ship_specs[i][0] === length) {
			if (score[color][i][1] + increment >= 0) {
				score[color][i][1] += increment;
				return true;
			} else
				return false;
		}
	return false;
};

/**
 * Checks if a new ship will obstruct any old ship
 * Returns obstructing ship if bad, false if good
 */
const badShip = (ship,color) => {
	for (var i in ships[color])
		if (ship.obstructs(ships[color][i]))
			return ships[color][i];
	return false;
};
/**
 * Add a ship to the list of built ships
 */
const addShip = (ship,color) => {
	ships[color].push(ship);
};
/**
 * Detelete a target ship
 * If not in preparation, check if end of game when 0 ships left
 */
const delShip = (ship,color) => {
	for (var i in ships[color]) {
		if (ship.equals(ships[color][i])) {
			ships[color].splice(i,1);
			return (ships[color].length === 0);
		}
	}
	return false;
};

/**
 * Perform iterative task on line
 * If assigning, color tiles between c1 and c2 into other_color, on board type color
 * If not assigning, do not color and return false if line not of a uniform color
 */
const iterateLine = (c1,c2,color,other_color,assigning) => {
	var ret_line = [];
	var index;
	for (let i=0; i <= c1.dist(c2); i++) {
		if (c1.row === c2.row)
			index = c1.row*size + (Math.min(c1.col,c2.col)+i);
		else
			index = (Math.min(c1.row,c2.row)+i)*size + c1.col;
		if (assigning) {
			board[color][index] = other_color;
			ret_line.push({number: index, color: other_color});
		} else if (board[color][index] !== other_color)
			return false;
	}
	return ret_line;
};

/**
 * Action when a tile is clicked during preparation
 * if no green tile is present, create a green tile on empty tile, or delet a ship
 * if green tile is present, try to create a ship, erase green tile if unsuccessful
 */
const prepare = tile => {
	const move = new Coordinate(tile.number,size);
	if (last_move === null) {
		const ship = badShip(new Ship(move,move),tile.color);
		if (!ship) {
			last_move = move;
			board[tile.color][tile.number] = 1;
			return [{number: tile.number, color: 1}];
		} else {
			delShip(ship,tile.color);
			editScore(tile.color, ship.size, 1);
			return iterateLine(ship.c1,ship.c2,tile.color,0,true);
		}
	} else {
		const tmp_move = last_move;
		last_move = null;
		const new_ship = new Ship(move,tmp_move);
		if (!badShip(new_ship,tile.color) && editScore(tile.color, new_ship.size, -1)) {
			addShip(new_ship,tile.color)
			return iterateLine(move,tmp_move,tile.color,3,true);
		} else {
			board[tile.color][tmp_move.row*size + tmp_move.col] = 0;
			return [{number: tmp_move.row*size + tmp_move.col, color: 0}];
		}
	}
};

/**
 * Action when a tile is clicked during a player's turn
 * Already guessed tiles are ignored, misses turn green and hits turn orange.
 * If a hit sinks a ship, the whole ship turns black and the player's score increases
 */
const takeTurn = tile => {
	if (board[tile.color][tile.number] !== 0)
		return [];
	nextState();

	const other_color = tile.color === 'blue' ? 'red' : 'blue';
	const move = new Coordinate(tile.number,size);
	const ship = badShip(new Ship(move,move),other_color);
	
	if (ship) {
		board[tile.color][tile.number] = 2;
		if (iterateLine(ship.c1,ship.c2,tile.color,2,false)) {
			if (delShip(ship,other_color)) {
				// trigger end of game
				state = tile.color + 'win';
				return [];
			}
			editScore(tile.color, ship.size, 1);
			return iterateLine(ship.c1,ship.c2,tile.color,3,true);
		}
		return [{number: tile.number, color: 2}];
	}
	board[tile.color][tile.number] = 1;
	return [{number: tile.number, color: 1}];
};

/**
 * Flow control for a tile click
 * Prevents a player's actions when it's not their turn
 */
exports.tileClick = tile => {
	if (state === tile.color + 'prep')
		return prepare(tile);
	else if (state === tile.color + 'turn')
		return takeTurn(tile);
	else if (state === tile.color + 'end')
		nextState();
	return [];
};
