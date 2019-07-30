const EXPRESS = require('express');
const FILEUPLOAD = require('express-fileupload');
const FS = require('fs');
const PATH = require('path');
const APP = EXPRESS();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

APP.use(FILEUPLOAD());

APP.put('/upload/:tipo/:id', function(req, res) {

	let tipo = req.params.tipo;
	let id = req.params.id;

	if (Object.keys(req.files).length == 0) res.status(400).json({ ok: false, err: { message: 'No se ha seleccionado ningun archivo' }});

	// Valida tipo
	let tiposValidos = ['productos', 'usuarios'];

	if (tiposValidos.indexOf(tipo) < 0) res.status(400).json({ ok: false, err: { message: 'Los tipos validos son ' + tiposValidos.join(' y ') }});

	let archivo = req.files.archivo;
	// Extenciones permitidas
	let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

	let nombreCortado = archivo.name.split('.');
	let extension = nombreCortado[nombreCortado.length - 1];

	if (extencionesValidas.indexOf(extension) < 0) res.status(400).json({ ok: false, err: { message: 'Las extensiones permitidas son ' 
																																													+ extensionesValidas.join(', ')}});
	
	// Cambiar nombre al archivo
	let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
	
		if (err) res.status(500).json({ ok: false, err});
	
		// Aqui, imagen cargada
		if (tipo === 'usuarios'){
		
			imagenUsuario(id, res, nombreArchivo);
		} else if (tipo === 'productos') {

			imagenProducto(id, res, nombreArchivo);
		}
	});
});

function imagenUsuario(id, res, nombreArchivo) {

	Usuario.findById(id, (err, usuarioDB) => {

		if (err) {
			borraArchivo('usuarios', nombreArchivo);

			return res.status(500).json({ ok: false, err });
		}
		
		if (!usuarioDB) {
			borraArchivo('usuarios', nombreArchivo);

			return res.status(400).json({ ok: false, err: { message: 'Usuario no existe' } });
		}

		borraArchivo('usuarios', usuarioDB.img);
		
		usuarioDB.img = nombreArchivo;
		usuarioDB.save((err, usuarioGuardado) => {
			
			if (err) res.status(500).json({ ok: false, err });
			
			res.json({
				ok: true,
				usuario: usuarioGuardado,
				img: nombreArchivo,
				message: 'Imagen subida correctamente'
			});
		});
	});
}

function imagenProducto(id, res, nombreArchivo) {

	Producto.findById(id, (err, productoDB) => {

		if (err) {
			borraArchivo('productos', nombreArchivo);
			
			return res.status(500).json({ ok: false, err });
		}
		if (!productoDB) {
			borraArchivo('productos', nombreArchivo);

			return res.status(500).json({ ok: false, err: { message: 'No existe el producto' }});
		}

		borraArchivo('productos', productoDB.img);

		productoDB.img = nombreArchivo;
		productoDB.save((err, productoGuardado) => {

			if (err) res.status(400).json({ ok: false, err });

			res.json({
				ok: true,
				message: 'Archivo subido correctamente',
				img: productoGuardado
			});
		});
	});
}

function borraArchivo(tipo, img) {

	let pathImg = PATH.resolve(__dirname, `../../uploads/${tipo}/${img}`);

	if (FS.existsSync(pathImg)) FS.unlinkSync(pathImg);
}

module.exports = APP;
