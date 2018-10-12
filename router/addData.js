const db = require('../mysql.config');
const axios = require('axios');

module.exports = async ctx => {
    if (ctx.query.count) {
        //查询remind表
        await new Promise((resolve, reject) => {
            db.query('SELECT * FROM remind_table', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        }).then(async data => {
            //获取access_token
            let r = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxced61e8b4ea7c2d9&secret=c6f920efa74d64b6669ffc6e69d7ff3f');
            for (let i in data) {
                if (ctx.query.count < data[i].remind_count) {
                    //...发送模板消息
                    let t = new Date(data[i].add_time);
                    await axios.post(`https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${r.data.access_token}`, {
                        touser: data[i].open_id,
                        template_id: 'XUOlXV97vDqZcHI0o-kXba3KFmoOb54acsZOyLcXmIU',
                        form_id: data[i].form_id,
                        data: {
                            "keyword1": {
                                "value": `${t.getUTCMonth()+1}月${t.getUTCDate()}日`
                            },
                            "keyword2": {
                                "value": "「 清泉浴室 」"
                            },
                            "keyword3": {
                                "value": `当前浴室只有${ctx.query.count}人：已小于你的预定值，可以愉快地去洗澡啦～`
                            }
                        }
                    })
                    //...删除记录
                    await new Promise((resolve, reject) => {
                        db.query(`DELETE FROM remind_table WHERE open_id="${data[i].open_id}"`, (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        })
                    })
                }
            }
        });

        /********* */
        ctx.body = await new Promise((resolve, reject) => {
            db.query(`INSERT INTO data_table (sensor_data) VALUES (${ctx.query.count})`, err => {
                if (err) {
                    reject({msg:'Mysql Error!'});
                    console.error(err);
                } else {
                    resolve({msg:'OK'});
                }
            });
        });
    } else {
        ctx.body = {msg:'Request Error : Don\'t Have Count'};
    }
}