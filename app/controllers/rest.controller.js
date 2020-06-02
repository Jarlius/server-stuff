const model = require('../model.js');
const express = require('express');
const router = express.Router();

router.get('/state', function(req, res) {
	console.log(model.state);
	res.json({ ans: model.state });
});

router.post('/test', function(req, res) {
	console.log(req.body.msg);
	res.json({ans: req.body.msg});
});

module.exports = router;
