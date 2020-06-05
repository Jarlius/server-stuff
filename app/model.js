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
board['blue'] = Array(size*size).fill(0);
board['red'] = Array(size*size).fill(0);

var last_move = new Coordinate(0,size);

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
 * Try to change the program state into its next state
 */
nextState = color => {
	switch (state) {
	case 'start':
		state = 'blueprep';
		break;
	case 'blueprep':
		if (color === 'blue' && !checkScoreZero('blue'))
			break;
		board['blue'] = Array(size*size).fill(0);
		state = 'redprep';
		break;
	case 'redprep':
		if (color === 'red' && !checkScoreZero('red'))
			break;
		board['red'] = Array(size*size).fill(0);
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
	return state;
};
exports.nextState = nextState;

/**
 * Change current score by 1/-1, when a ship is deleted/added
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
	var false_or_ship = false;
	for (var i in ships[color])
		if (ship.obstructs(ships[color][i]))
			false_or_ship = ships[color][i];
	return false_or_ship;
};
/**
 * Add a ship to the list of built ships
 * Impossible if ship is bad or if the length is bad/already used
 */
const addShip = (ship,color) => {
	if (badShip(ship,color))
		return false;
	if (editScore(color, ship.size, -1))
		ships[color].push(ship);
	else
		return false;
	return true;
};
/**
 * Detelete a target ship
 * If not in preparation, check if end of game when 0 ships left
 */
const delShip = (ship,color,playing) => {
	for (var i in ships[color]) {
		if (ship.equals(ships[color][i])) {
			ships[color].splice(i,1);
			editScore(color, ship.size, 1);
			// TODO trigger end of game if ships[color].length === 0 and playin === true
		}
	}
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
			board[color][index-1] = other_color;
			ret_line.push({number: index, color: other_color});
		} else if (board[color][index-1] !== other_color)
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
	if (last_move.equals(new Coordinate(0,size))) {
		const ship = badShip(new Ship(move,move),tile.color);
		if (!ship) {
			last_move = move;
			return [{number: tile.number, color: 1}];
		} else {
			delShip(ship,tile.color,false);
			return iterateLine(ship.c1,ship.c2,tile.color,0,true);
		}
	} else {
		const tmp_move = last_move;
		last_move = new Coordinate(0,size);
		if (tmp_move.dist(move) !== 0 && addShip(new Ship(move,tmp_move),tile.color))
			return iterateLine(move,tmp_move,tile.color,3,true);
		else
			return [{number: tmp_move.row*size + tmp_move.col, color: 0}];
	}
};

const takeTurn = tile => {
	var new_tile = [{number: tile.number, color: 1}];
	
	if (state === (tile.color + 'turn'))
		board[tile.color][new_tile.number] = new_tile.color;
	else {
		new_tile = [];
		if (state !== 'blueend' && state !== 'redend')
			return new_tile;
	}
	nextState(tile.color);
	return new_tile;
};

exports.tileClick = tile => {
	if (state === 'blueprep' || state === 'redprep')
		return prepare(tile);
	else
		return takeTurn(tile);
};
