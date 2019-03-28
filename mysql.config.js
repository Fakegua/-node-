const Mysql = require('mysql');

const db = Mysql.createPool({
    host: 'localhost',
    user: '',
    password: '',
    database: ''
})

module.exports = db;