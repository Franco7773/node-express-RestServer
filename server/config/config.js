//===========================|
//********* PORT ************|
//===========================|

process.env.PORT = process.env.PORT || 3777;

//===========================|
//******** Entorno **********|
//===========================|

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================|
//********* SEED ************|
//===========================|

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-seed-desarrollo';

//===========================|
//***** expires token *******|
//===========================|

process.env.EXPIRA_TOKEN = 60 * 60 * 24 * 30;

//===========================|
//********** DB *************|
//===========================|

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL; 
}

process.env.URL_DB = urlDB;
