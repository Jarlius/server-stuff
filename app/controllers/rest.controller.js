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
	res.json(model.nextState(req.body.color));
});

router.post('/test', function(req, res) {
	console.log(req.body.msg);
	res.json({ans: req.body.msg});
});

module.exports = router;
