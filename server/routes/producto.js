const EXPRESS = require('express');
const APP = EXPRESS();
const { verificaToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');

// Obtener productos 
APP.get('/productos', verificaToken, (req, res) => {

	let desde = req.query.desde || 0;
	desde = Number(desde);

	Producto.find({ disponible: true }).skip(desde).limit(5).populate('categoria', 'descripcion').populate('usuario', 'nombre email').exec((err, productosDB) => {

		if (err) res.status(500).json({ pk: false, err: { message: 'No hay productos en este momento' }});

		res.json({
			ok: true,
			productos: productosDB
		});
	});
});

// Obtener producto por ID
APP.get('/productos/:id', verificaToken, (req, res) => {

	id = req.params.id;

	Producto.findById(id).populate('categoria', 'descripcion').populate('usuario', 'nombre email').exec((err, productoDB) => {

		if (err) res.status(500).json({ ok: false, err });
		if (!productoDB) res.status(400).json({ ok: false, err: { message: 'ID no existe' }});

		res.json({
			ok: true,
			producto: productoDB
		});
	});
});

// Buscar productos
APP.get('/productos/buscar/:termino', verificaToken, (req, res) => {

	let termino = req.params.termino;
	let regExp = new RegExp(termino, 'i');
	
	Producto.find({ disponible: true, nombre: regExp }).populate('categoria', 'descripcion').exec((err, productosDB) => {

		if (err) res.status(500).json({ ok: false, err });

		res.json({
			ok: true,
			productos: productosDB
		});
	});
});

// Crear nuevo producto
APP.post('/productos', verificaToken, (req, res) => {

	let body = req.body;

	producto = new Producto({
		nombre : body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria,
		usuario: req.usuario._id
	});

	producto.save((err, productoDB) => {

		if (err) res.status(500).json({ ok: false, err });
		if (!productoDB) res.status(500).json({ ok: false, err});

		res.status(201).json({
			ok: true,
			producto: productoDB
		});
	});
});

// Actualizar un producto
APP.put('/productos/:id', verificaToken, (req, res) => {

	let id = req.params.id;
	let body = req.body;

	Producto.findById(id, (err, productoDB) => {

		if (err) res.status(500).json({ ok: false, err});
		if (!productoDB) res.status(400).json({ ok: false, err: { message: 'El ID no existe' }});

		
		productoDB.nombre = body.nombre,
		productoDB.precioUni = body.precioUni,
		productoDB.categoria = body.categoria,
		productoDB.disponible = body.disponible,
		productoDB.descripcion = body.descripcion

		productoDB.save((err, productoGuardado) => {
			
			if (err) res.status(500).json({ ok: false, err });

			res.json({
				ok: true,
				producto: productoGuardado
			});
		});
	});
});

// Eliminar un producto
APP.delete('/productos/:id', verificaToken, (req, res) => {

	let id = req.params.id;

	Producto.findById(id, (err, productoDB) => {

		if (err) res.status(500).json({ ok: false, err });
		if (!productoDB) res.status(400).json({ ok: false, err: { message: 'El ID no existe' }}); 

		productoDB.disponible = false;
		productoDB.save((err, productoBorrado) => {

			if (err) res.status(500).json({ ok: false, err });

			res.json({
				ok: true,
				message: 'Producto eliminado',
				producto: productoBorrado
			});
		});
	});
});

module.exports = APP;
