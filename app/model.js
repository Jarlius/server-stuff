const Coordinate = require('./models/coordinate.model.js');
const Ship = require('./models/ship.model.js');

const size = 9;
const ship_specs = [[2,1],[3,2],[4,1],[5,1]];

var state = 'start';

var build_ships = [];
var blue_ships = [];
var red_ships = [];

var blue_board = [];
var red_board = [];

var last_move = new Coordinate(0,size);

/**
 * Read only get functions for model variables
 */
exports.getState = () => {return state;};
exports.getSize = () => {return size;};
exports.getBoards = color => {
/*	if (color === 'blue')
		return blue_board;
	else
		return red_board;
*/	return {blue: blue_board, red: red_board};
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

const badShip = (ship,color) => {
	// TODO
	return false;
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
	if (color === 'blue')
		blue_ships.push(ship);
	else
		red_ships.push(ship);
	return true;
};

const prepare = tile => {
	const move = new Coordinate(tile.number,size);
	if (last_move.equals(new Coordinate(0,size))) {
		const tile_occupied = badShip(Ship(move,move),tile.color);
		if (!tile_occupied) {
			last_move = move;
			return {number: tile.number, color: 1};
		} else {
			// TODO delete ship
			return {number: tile.number, color: 0};
		}
	} else {
		const tmp_move = last_move;
		last_move = new Coordinate(0,size);
		if (tmp_move.dist(move) !== 0 && addShip(new Ship(move,tmp_move),tile.color)) {
			console.log(blue_ships);
			// TODO paint the ship
			return {number: tmp_move.row*size + tmp_move.col, color: 0};
		} else
			return {number: tile.number, color: 0};
	}
};

const takeTurn = tile => {
	var new_tile = {number: tile.number, color: 1};
	
	if (state === 'blueturn' && tile.color === 'blue')
		blue_board.push(new_tile);
	else if (state === 'redturn' && tile.color === 'red')
		red_board.push(new_tile);
	else {
		new_tile = {number: 0, color: 0};
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
