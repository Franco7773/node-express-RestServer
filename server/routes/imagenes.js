const EXPRESS = require('express');
const FS = require('fs');
const PATH = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');


const APP = EXPRESS();

APP.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

	let tipo = req.params.tipo;
	let img = req.params.img;

	let pathImg = `./uploads/${ tipo }/${ img }`;
	let pathImagen = PATH.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

	if (FS.existsSync(pathImagen)) {
			
		res.sendFile(pathImagen);
	} else {

		let noImagePath = PATH.resolve(__dirname, '../assets/no-image.jpg')
		res.sendFile(noImagePath);
	}


});





module.exports = APP;
