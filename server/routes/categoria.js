const EXPRESS = require('express');
const APP = EXPRESS();

let { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');

// Mostrar todas las categorias
APP.get('/categoria', verificaToken, (req, res) => {

	let desde = 0;
	let hasta = 7;

	Categoria.find({}).sort('descripcion').populate('usuario', 'nombre email').skip(desde).limit(hasta).exec( (err, categorias) => {

			if (err) res.status(500).json({ ok: false, err: { message: 'Hubo un error' }});

			res.json({
				ok: true,
				categorias
			});
	});
});


// Mostrar una categoia por ID
APP.get('/categoria/:id', verificaToken, (req, res) => {
    
	let id = req.params.id;
	
	Categoria.findById(id, (err, categoriaDB) => {

		if (err) res.status(500).json({ ok: false, err });
		if (!categoriaDB) res.status(500).json({ ok: false, err: { message: 'El ID no es valido' }});
		
		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});


// Crear nueva categoria
APP.post('/categoria', verificaToken, (req, res) => {
	// regresa la nueva categoria
	// req.usuario._id
	let body = req.body;

	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id
	});

	categoria.save( (err, categoriaDB) => {

		if (err) res.status().json({ ok: false, err: { message: 'Error'  }});
		if (!categoriaDB) res.status(400).json({ ok: false, err});

		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});


// actualizar todas las categorias
APP.put('/categoria/:id', verificaToken, (req, res) => {
    
	let id = req.params.id;
	let body = req.body;
	
	let descCategoria = {
		descripcion: body.descripcion
	};

	Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
		
		if (err) res.status(500).json({ ok: false, err });
		if (!categoriaDB) res.status(400).json({ ok: false, err });

		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});


// Eliminar
APP.delete('/categoria/:id', [verificaToken, verificaAdmin], (req, res) => {

	let id = req.params.id;
	
	Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

		if (err) res.status(500).json({ ok: false, err });
		if (!categoriaDB) res.status(400).json({ ok: false, err: { message: 'El id no existe' } });

		res.json({
			ok: true,
			message: 'Categoria Borrada'
		});
	});  
});



module.exports = APP;

