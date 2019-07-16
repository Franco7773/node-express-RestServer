//===========================|
//********* PORT ************|
//===========================|

process.env.PORT = process.env.PORT || 3777;

//===========================|
//******** Entorno **********|
//===========================|

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================|
//********** DB *************|
//===========================|

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://franco7773:dgdgdg@cluster0-mk70n.mongodb.net/cafe'; 
}

process.env.URL_DB = urlDB;
