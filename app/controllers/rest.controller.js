const express = require('express');
const router = express.Router();

var state = 'start';

router.get('/state', function(req, res) {
	res.json({ ans: state });
});

router.post('/test', function(req, res) {
	console.log(req.body.msg);
	res.json({ans: req.body.msg});
});

module.exports = router;
