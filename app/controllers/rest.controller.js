const express = require('express');
const router = express.Router();

router.post('/test', function(req, res) {
	console.log(req.body.msg);
	res.json({ans: req.body.msg});
});

module.exports = router;
