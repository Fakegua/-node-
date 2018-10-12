const Mysql = require('mysql');

const db = Mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345687',
    database: 'TCOPS'
})

module.exports = db;