const EXPRESS = require('express');
const APP = EXPRESS();

APP.use(require('./login'));
APP.use(require('./usuario'));

module.exports = APP;