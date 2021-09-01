const Express = require('express');
const Router = Express.Router();

Router.get('/acme-challenge/:token', function(req, res) {
	res.json({
		token: req.params.token,
		msg: "ayylmao"
	});
});

module.exports = Router;
