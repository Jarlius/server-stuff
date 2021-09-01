const Express = require('express');
const Router = Express.Router();

Router.get('/acme-challenge/:token', function(req, res) {
	res.sendFile('/tmp/acmetokens/' + req.params.token);
});

module.exports = Router;
