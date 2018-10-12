const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
/**
 * 路由处理
 */
router.get('/addData', require('./router/addData'));
router.get('/getTime', require('./router/getTime'));
router.get('/getDataLine', require('./router/getDataLine'));
router.get('/addRemind', require('./router/addRemind'));

app.use(router.routes()).use(router.allowedMethods());

app.listen(8088, () => {
    console.log('服务器已创建,端口号：8088');
})