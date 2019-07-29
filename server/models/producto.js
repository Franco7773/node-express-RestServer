const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;

let productoSchema = new Schema({
	nombre: {
		type: String,
		required: [ true, 'El nombre es necesario' ]
	},
	precioUni: {
		type: Number,
		required: [ true, 'El precio únitario es ncesario' ]
	},
	descripcion: {
		type: String,
		required: false
	},
	disponible: {
		type: Boolean,
		required: true,
		default: true
	},
	categoria: {
		type: Schema.Types.ObjectId,
		ref: 'Categoria'
	},
	usuario: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario'
	}
});

module.exports = MONGOOSE.model('Producto', productoSchema);
