const EXPRESS = require('express');
const BCRYPT = require('bcrypt');
const JWT = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Client = new OAuth2Client(process.env.CLIENT_ID);
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

// Configuración de google
async function verify( token ) {
  const ticket = await Client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
	const payload = ticket.getPayload();

	return {
		nombre: payload.name,
		email: payload.email,
		img: payload.picture,
		google: true
	}
}

APP.post('/google', async(req, res) => {

	let token = req.body['idtoken'];
	
	let googleUser = await verify(token).catch( e => {

		return res.status(403).json({
			ok: false,
			err: e
		});
	});
	
	// console.log(googleUser);
	Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

		if (err) res.status(500).json({ ok: false, err });

		if (usuarioDB) {
			// console.log(usuarioDB);
			if (!usuarioDB.google) { 

				return res.status(400).json({ ok:false, err: { message: 'Debe de utilizar su autenticación normal' }});
			} else {

				let token = JWT.sign({ usuario: usuarioDB}, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRA_TOKEN });

				return  res.json({
					ok: true,
					usuario: usuarioDB,
					token
				});
			}
		} else {
			// Si el usuario no existe en nuestra base de datos
			let usuario = new Usuario();
			usuario.nombre = googleUser.nombre;
			usuario.email = googleUser.email;
			usuario.img = googleUser.img;
			usuario.google = googleUser.google;
			usuario.password = ':)';

			usuario.save(( err, usuarioDB) => {

				if (err) res.status(500).json({ ok: false, err });
				
				let token = JWT.sign({ usuario: usuarioDB}, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRA_TOKEN });

				return  res.json({
					ok: true,
					usuario: usuarioDB,
					token
				});
			});
		}
	});
});

module.exports = APP;
