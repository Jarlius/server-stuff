const model = require('../model.js');
const express = require('express');
const router = express.Router();

router.get('/state/:color', function(req, res) {
	res.json(model.getState(req.params.color));
});

router.post('/test', function(req, res) {
	console.log(req.body.msg);
	res.json({ans: req.body.msg});
});

module.exports = router;
