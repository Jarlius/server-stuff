const setupBoilerplate = require('./boilerplate/setup.js');

const { app } = setupBoilerplate();
const port = 8989;

// use /api for REST router, to not interfere with regular urls
const router = require('./controllers/rest.controller.js');
app.use('/api', router);

app.listen(port);
