const model = require('../model.js');
const express = require('express');
const router = express.Router();

/**
 * Set up all information when refreshing browser
 * Format: { state, turn, size, [color]score, boards(tile{n,color})[blue, red]
 */
router.get('/state/:color', function(req, res) {
	const color = model.colorToNumber(req.params.color);
	res.json({
		state: model.getState().state,
		player: model.getState().player,
		turn: model.getTurn(),
		size: model.getSize(),
		score: model.getScore(color),
		boards: model.getBoards(color)
	});
});

module.exports = router;
