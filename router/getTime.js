const db = require('../mysql.config');

module.exports = async ctx => {
    let queryResult = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM test_table ORDER BY id DESC LIMIT 1', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
    queryResult = new Date(queryResult[0].send_time);
    ctx.body = {
        "year": queryResult.getUTCFullYear(),
        "month": queryResult.getUTCMonth() + 1,
        "day": queryResult.getUTCDate(),
        "hour": queryResult.getUTCHours(),
        "minute": queryResult.getUTCMinutes(),
        "second": queryResult.getUTCSeconds()
    }
}