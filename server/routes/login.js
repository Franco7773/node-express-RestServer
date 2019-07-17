const EXPRESS = require('express');
const BCRYPT = require('bcrypt');
const JWT = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const APP = EXPRESS();

APP.post('/login', (req, res) => {

	let body = req.body;

	Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

		if (err) res.status(500).json({ ok: false, err});
		if (!usuarioDB) res.status(401).json({ok: false,	err: { message: 'Usuario o contraseña incorrectos' }});

		if (!BCRYPT.compareSync( body.password, usuarioDB.password)) res.status(401).json({	ok: false, err: { message: 'Usuario o contraseña incorrectos' } });

		let token = JWT.sign({
			usuario: usuarioDB
		}, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRA_TOKEN});

		res.json({
			ok: true,
			usuario: usuarioDB,
			token
		});
	});
});


module.exports = APP;
