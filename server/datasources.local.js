//Configuración específica del entorno
'use strict';
var config = require('./config.local.js');

module.exports = {
  mysqlDs: {
    name : 'mysqlDs',
    connector: 'mysql',
    hostname: config.db_host,
    port: config.db_port,
    user: config.db_user,
    password: config.db_password,
    database: 'listaFamiliar'
  }
};