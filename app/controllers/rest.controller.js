const model = require('../model.js');
const express = require('express');
const router = express.Router();

/**
 * Set up all information when refreshing browser
 * Format: { state, turn, size, blueboard[tile{n,color}], redboard[tile{n,color}] }
 */
router.get('/state/:color', function(req, res) {
	res.json(model.getState(req.params.color));
});

router.post('/control', function(req, res) {
	res.json({state: model.nextState(req.body.color)});
});

router.post('/tileclick', function(req, res) {
	tile = model.tileClick(req.body);
	res.json({state: model.nextState(req.body.color), tile: tile});
});

module.exports = router;
