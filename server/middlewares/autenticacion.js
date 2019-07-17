const JWT = require('jsonwebtoken');

//===========================|
//**** Verificar token ******|
//===========================|

let verificaToken = (req, res, next) => {
	
	let token = req.get('Authorization'); 
	
	JWT.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
		
		if (err) res.status(401).json({ ok: false, err: { message: 'Token no válido' }});
		
		req.usuario = decoded.usuario;
		
		next();
	});
};

//===========================|
//**** Verificar Role *******|
//===========================|

let verificaAdmin = (req, res, next) => {

	let usuario = req.usuario;
	
	if (usuario.role === 'ADMIN_ROLE') {
		next();
	} else {

		return res.status(401).json({ ok: false, err: { message: 'El usuario no es Administrador' }});
	}
};


module.exports = {
	verificaToken,
	verificaAdmin
};
