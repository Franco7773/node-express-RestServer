require('./config/config');
const EXPRESS = require('express');
const APP = EXPRESS();
const MONGOOSE = require('mongoose');
const PATH = require('path');

const BODYparser = require('body-parser');
// Parse application/x-www-form-urlencoded
APP.use(BODYparser.urlencoded({ extended: false }));
// Parse application/json
APP.use(BODYparser.json());

// Habilitar la carpeta public
APP.use(EXPRESS.static( PATH.resolve(__dirname, '../public')));

APP.use( require('./routes/index'));

MONGOOSE.connect(process.env.URL_DB, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
	if (err) throw err;
	console.log('DB Online');
});

APP.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${ process.env.PORT }`);
})

