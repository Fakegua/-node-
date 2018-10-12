const db = require('../mysql.config');

module.exports = async ctx => {
    if (!ctx.query.openID || !ctx.query.remindCount || !ctx.query.formID) {
        ctx.body = {msg:'信息不完整'};
    } else {
        /**
         * 查找重复openID逻辑
         */
        await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM remind_table WHERE open_id="${ctx.query.openID}"`, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }); 
        }).then(async data => {
            ctx.body = await new Promise((resolve, reject) => {
                //如果openID已存在，更新数据；否则直接插入
                if (data.length >= 1) {
                    //每五分钟只能预约一次
                    let add_time = new Date(data[0].add_time);
                    let now_time = new Date();
                    if (now_time.getTime() - add_time.getTime() < 1000 * 60 * 5) {
                        resolve({msg:'请五分钟之后再操作'});
                    } else {
                        db.query(`UPDATE remind_table SET remind_count="${ctx.query.remindCount}",form_id="${ctx.query.formID}",add_time=CURRENT_TIMESTAMP WHERE open_id="${data[0].open_id}"`, (err, data) => {
                            if (err) {
                                reject({msg:'更新错误'});
                                console.error(err);
                            } else {
                                resolve({msg:'更新提醒成功'});
                            }
                        });
                    }
                } else {
                    db.query(`INSERT INTO remind_table (open_id,remind_count,form_id) VALUES ("${ctx.query.openID}","${ctx.query.remindCount}","${ctx.query.formID}")`, (err, data) => {
                        if (err) {
                            reject({msg:'插入错误'});
                            console.error(err);
                        } else {
                            resolve({msg:'添加提醒成功'});
                        }
                    })
                }
            })
        }).catch((err) => {
            console.error(err);
            ctx.body = {msg:'数据库错误'};
        })
    }
}