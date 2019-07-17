const EXPRESS = require('express');
const BCRYPT = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');

const APP = EXPRESS();


APP.get('/usuario', verificaToken, (req, res) => {

	// return res.json({
	// 	usuario: req.usuario,
	// 	nombre: req.usuario.nombre,
	// 	email: req.usuario.email
	// });
		
	let activos = { estado: true };
	let desde = Number(req.query.desde) || 0;
	let limite = Number(req.query.limite) || 5;
	
	Usuario.find( activos, 'nombre email role estado google img').skip(desde).limit(limite).exec( (err, usuarios) => {

		if (err) res.status(400).json({ok: false, err});

		Usuario.count( activos, (err, conteo) => {

			res.json({
				ok: true,
				usuarios,
				usuario: conteo
			});
		});
	});
});

APP.post('/usuario', [verificaToken, verificaAdmin], (req, res) => {

	let body = req.body;

	let usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: BCRYPT.hashSync(body.password, 11),
		role: body.role
	});



	usuario.save( (err, usuarioDB) => {

		if (err) res.status(400).json({ ok: false, err });

		res.json({
			ok: true,
			usuario: usuarioDB
		});
	});
});

APP.put('/usuario/:id', [verificaToken, verificaAdmin], (req, res) => {

	let id = req.params.id;
	let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

	Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

		if (err) res.status(400).json({ok: false, err});
		
		res.json({
			ok: true,
			usuario: usuarioDB
		});
	});
});

APP.delete('/usuario/:id', [verificaToken, verificaAdmin], (req, res) => {

	let id = req.params.id;
	let cambiaEstado = {
		estado: false
	};
	// Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
	Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

		if (err) res.status(400).json({ok: false, err});

		if (!usuarioBorrado) res.status(400).json({ok: false, err: { message: 'Usuario no encontrado' } });

		res.json({
			ok: true,
			usuario: usuarioBorrado
		});
	});
});

module.exports = APP;
