const setupBoilerplate = require('./boilerplate/setup.js');

const { app } = setupBoilerplate();
const port = 8989;

const router = require('./controllers/rest.controller.js');
app.use('/', router);

app.listen(port);
