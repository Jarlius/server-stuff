const model = require('../model.js');
const express = require('express');
const router = express.Router();

/**
 * Set up all information when refreshing browser
 * Format: { state, turn, size, [color]score, boards(tile{n,color})[blue, red]
 */
router.get('/state/:color', function(req, res) {
	res.json({
		state: model.getState(),
		// TODO turns
		size: model.getSize(),
		score: model.getScore(req.params.color),
		boards: model.getBoards(req.params.color)
	});
});

module.exports = router;
