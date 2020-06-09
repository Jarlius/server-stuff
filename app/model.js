const Coordinate = require('./models/coordinate.model.js');
const Ship = require('./models/ship.model.js');

const ships = require('./models/ships.model.js');
const score = require('./models/score.model.js');
const state = require('./models/state.model.js');

const size = 9;
const ship_specs = [[2,1],[3,2],[4,1],[5,1]];

var turn = 0;

var board = [[],[]];

var last_move = null;

var colors = [];
colors['blue'] = 0;
colors['red'] = 1;

/**
 * Convert frontend's color string into integer
 */
exports.colorToNumber = color => {
	return colors[color];
};

/**
 * Read only get functions for model variables
 */
exports.getState = () => {return state.get();};
exports.getSize = () => {return size;};
exports.getTurn = () => {return turn;};
exports.getScore = color => {return score.get(color);};
exports.getBoards = color => {
	const cur = state.get();
	if (cur.state === 'prep') {
		if (color)
			return {blue: [], red: board[1]};
		else
			return {blue: board[0], red: []};
	}
	return {blue: board[0], red: board[1]};
};

/**
 * Control flow for a button press
 * Initialises arrays and changes states
 */
exports.controlButton = color => {
	const cur = state.get();
	switch (cur.state) {
	case 'start':
		turn = 0;
		score.reset(ship_specs,[0,1]);
		ships.reset([0,1]);
		board[0] = Array(size*size).fill(0);
		board[1] = Array(size*size).fill(0);
		break;
	case 'prep':
		if (color !== cur.player || !score.isZero(color))
			return;
		board[color] = Array(size*size).fill(0);
		if (color)
			turn = 1;
		break;
	default:
		break;
	}
	state.next();
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
const prepare = (number,color) => {
	const move = new Coordinate(number,size);
	if (last_move === null) {
		const ship = ships.badShip(new Ship(move,move),color);
		if (!ship) {
			last_move = move;
			board[color][number] = 1;
			return [{number: number, color: 1}];
		} else {
			ships.delShip(ship,color);
			score.edit(color, ship.size, 1);
			return iterateLine(ship.c1,ship.c2,color,0,true);
		}
	} else {
		const tmp_move = last_move;
		last_move = null;
		const new_ship = new Ship(move,tmp_move);
		if (!ships.badShip(new_ship,color) && score.edit(color, new_ship.size, -1)) {
			ships.addShip(new_ship,color);
			return iterateLine(move,tmp_move,color,3,true);
		} else {
			board[color][tmp_move.row*size + tmp_move.col] = 0;
			return [{number: tmp_move.row*size + tmp_move.col, color: 0}];
		}
	}
};

/**
 * Action when a tile is clicked during a player's turn
 * Already guessed tiles are ignored, misses turn green and hits turn orange.
 * If a hit sinks a ship, the whole ship turns black and the player's score increases
 */
const takeTurn = (number,color) => {
	if (board[color][number] !== 0)
		return [];
	state.next();

	const move = new Coordinate(number,size);
	const ship = ships.badShip(new Ship(move,move),+!color);
	
	if (ship) {
		board[color][number] = 2;
		if (iterateLine(ship.c1,ship.c2,color,2,false)) {
			if (ships.delShip(ship,+!color)) {
				// trigger end of game
				state.gameover();
				return [];
			}
			score.edit(color, ship.size, 1);
			return iterateLine(ship.c1,ship.c2,color,3,true);
		}
		return [{number: number, color: 2}];
	}
	board[color][number] = 1;
	return [{number: number, color: 1}];
};

/**
 * Flow control for a tile click
 * Prevents a player's actions when it's not their turn
 */
exports.tileClick = (number,color) => {
	const cur = state.get();
	var arr = [[],[]];
	if (color !== cur.player)
		;// do nothing
	else if (cur.state === 'prep')
		arr[cur.player] = prepare(number,color);
	else if (cur.state === 'turnplay') {
		const tiles = takeTurn(number,color);
		arr[0] = tiles;
		arr[1] = tiles;
	}
	else if (cur.state === 'turnend') {
		if (color)
			turn++;
		state.next();
	}
	return arr;
};
