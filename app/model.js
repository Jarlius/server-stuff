const Coordinate = require('./models/coordinate.model.js');
const Ship = require('./models/ship.model.js');

const ships = require('./models/ships.model.js');
const score = require('./models/score.model.js');

const size = 9;
const ship_specs = [[2,1],[3,2],[4,1],[5,1]];

var state = 'start';
var turn = 0;

var board = [[],[]];

var last_move = null;

var colors = [];
colors['blue'] = 0;
colors['red'] = 1;

/**
 * Read only get functions for model variables
 */
exports.getState = () => {return state;};
exports.getSize = () => {return size;};
exports.getTurn = () => {return turn;};
exports.getScore = color => {return score.get(colors[color]);};
exports.getBoards = color => {
/*	if (state === 'blueprep' || state === 'redprep') {
		if (color === 'blue')
			return {blue: board['blue'], red: []};
		else
			return {blue: [], red: board['red']};
	}
*/	return {blue: board[0], red: board[1]};
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
		turn = 0;
		score.reset(ship_specs,[0,1]);
		ships.reset([0,1]);
		board[0] = Array(size*size).fill(0);
		break;
	case 'blueprep':
		if (color !== 'blue' || !score.isZero(0))
			return;
		board[0] = Array(size*size).fill(0);
		board[1] = Array(size*size).fill(0);
		break;
	case 'redprep':
		if (color !== 'red' || !score.isZero(1))
			return;
		board[1] = Array(size*size).fill(0);
		turn = 1;
		break;
	default:
		break;
	}
	nextState();
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
			board[colors[color]][index] = other_color;
			ret_line.push({number: index, color: other_color});
		} else if (board[colors[color]][index] !== other_color)
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
		const ship = ships.badShip(new Ship(move,move),colors[tile.color]);
		if (!ship) {
			last_move = move;
			board[colors[tile.color]][tile.number] = 1;
			return [{number: tile.number, color: 1}];
		} else {
			ships.delShip(ship,colors[tile.color]);
			score.edit(colors[tile.color], ship.size, 1);
			return iterateLine(ship.c1,ship.c2,tile.color,0,true);
		}
	} else {
		const tmp_move = last_move;
		last_move = null;
		const new_ship = new Ship(move,tmp_move);
		if (!ships.badShip(new_ship,colors[tile.color]) && score.edit(colors[tile.color], new_ship.size, -1)) {
			ships.addShip(new_ship,colors[tile.color])
			return iterateLine(move,tmp_move,tile.color,3,true);
		} else {
			board[colors[tile.color]][tmp_move.row*size + tmp_move.col] = 0;
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
	if (board[colors[tile.color]][tile.number] !== 0)
		return [];
	nextState();

	const other_color = tile.color === 'blue' ? 'red' : 'blue';
	const move = new Coordinate(tile.number,size);
	const ship = ships.badShip(new Ship(move,move),colors[other_color]);
	
	if (ship) {
		board[colors[tile.color]][tile.number] = 2;
		if (iterateLine(ship.c1,ship.c2,tile.color,2,false)) {
			if (ships.delShip(ship,colors[other_color])) {
				// trigger end of game
				state = tile.color + 'win';
				return [];
			}
			score.edit(colors[tile.color], ship.size, 1);
			return iterateLine(ship.c1,ship.c2,tile.color,3,true);
		}
		return [{number: tile.number, color: 2}];
	}
	board[colors[tile.color]][tile.number] = 1;
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
	else if (state === tile.color + 'end') {
		if (tile.color === 'red')
			turn++;
		nextState();
	}
	return [];
};
