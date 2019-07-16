require('./config/config');
const EXPRESS = require('express');
const APP = EXPRESS();
const MONGOOSE = require('mongoose');

const BODYparser = require('body-parser');
// Parse application/x-www-form-urlencoded
APP.use(BODYparser.urlencoded({ extended: false }));
// Parse application/json
APP.use(BODYparser.json());

APP.use( require('./routes/usuario'));

MONGOOSE.connect(process.env.URL_DB, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
	if (err) throw err;
	console.log('DB Online');
});

APP.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${ process.env.PORT }`);
})

