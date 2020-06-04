const Coordinate = require('./models/coordinate.model.js');
const Ship = require('./models/ship.model.js');

const size = 9;
const ship_specs = [[2,1],[3,2],[4,1],[5,1]];

var state = 'start';

var build_ships = [];
var ships = [];
ships['blue'] = [];
ships['red'] = [];

var board = [];
board['blue'] = Array(size*size).fill(0);
board['red'] = Array(size*size).fill(0);

var last_move = new Coordinate(0,size);

/**
 * Read only get functions for model variables
 */
exports.getState = () => {return state;};
exports.getSize = () => {return size;};
exports.getBoards = color => {
/*	if (color === 'blue')
		return {blue: board['blue'], red: []};
	else
		return {blue: [], red: board['red']};
*/	return {blue: board['blue'], red: board['red']};
};

const buildInit = () => {
	for (var i in ship_specs) {
		for (var j=0; j < ship_specs[i][1]; j++)
			build_ships.push(ship_specs[i][0]);
	}
};

/**
 * Try to change the program state into its next state
 */
nextState = color => {
	switch (state) {
	case 'start':
		buildInit();
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
	default:
		break;
	}
	return state;
};
exports.nextState = nextState;

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
const addShip = (ship,color) => {
	if (badShip(ship,color))
		return false;
	var allowed_length = false;
	for (let i=0; i < build_ships.length; i++) {
		if (ship.size === build_ships[i]) {
			build_ships.splice(i,1);
			allowed_length = true;
		}
	}
	if (!allowed_length)
		return false;
	// TODO relay information of constructed ship somehow to frontend
	ships[color].push(ship);
	return true;
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
}

const prepare = tile => {
	const move = new Coordinate(tile.number,size);
	if (last_move.equals(new Coordinate(0,size))) {
		const tile_occupied = badShip(new Ship(move,move),tile.color);
		if (!tile_occupied) {
			last_move = move;
			return [{number: tile.number, color: 1}];
		} else {
			// TODO delete ship
			return [{number: tile.number, color: 0}];
		}
	} else {
		const tmp_move = last_move;
		last_move = new Coordinate(0,size);
		if (tmp_move.dist(move) !== 0 && addShip(new Ship(move,tmp_move),tile.color))
			return iterateLine(move,tmp_move,tile.color,1,true);
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
