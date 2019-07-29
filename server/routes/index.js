const EXPRESS = require('express');
const APP = EXPRESS();

APP.use(require('./login'));
APP.use(require('./usuario'));
APP.use(require('./categoria'));
APP.use(require('./producto'));

module.exports = APP;