const model = require('../model.js');
const express = require('express');
const router = express.Router();

/**
 * Set up all information when refreshing browser
 * Format: { state, turn, size, blueboard[tile{n,color}], redboard[tile{n,color}] }
 */
router.get('/state/:color', function(req, res) {
	res.json({
		state: model.getState(),
		size: model.getSize(),
		score: model.getScore(req.body.color),
		boards: model.getBoards(req.body.color)
	});
});

router.post('/control', function(req, res) {
	res.json({state: model.nextState(req.body.color)});
});

router.post('/tileclick', function(req, res) {
	tiles = model.tileClick(req.body);
	res.json({
		state: model.getState(),
		tiles: tiles
	});
});

module.exports = router;
