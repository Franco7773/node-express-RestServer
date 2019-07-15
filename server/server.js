require('./config/config');
const EXPRESS = require('express');
const APP = EXPRESS();

const BODYparser = require('body-parser');
// Parse application/x-www-form-urlencoded
APP.use(BODYparser.urlencoded({ extended: false }));
// Parse application/json
APP.use(BODYparser.json());

APP.get('/usuario', (req, res) => {
    
	res.json('get Usuario');
});

APP.post('/usuario', (req, res) => {

	let body = req.body;

	if ( body.nombre === undefined) {

		res.status(400).json({
			ok: false,
			msj: 'El nombre es necesaro'
		});

	} else {
	
		res.json({
			persona: body
		});
	}
});

APP.put('/usuario/:id', (req, res) => {

	let id = req.params.id;

	res.json({
			id
	});
});

APP.delete('/usuario', (req, res) => {

	res.json('delete Usuario');
});

APP.listen(process.env.PORT, () => {

	console.log(`Server listening on port ${ process.env.PORT }`);
})
