const Koa = require('koa')
const Router = require('koa-router');
const static = require('koa-static')
const ejs = require('koa-ejs');
const body = require('koa-better-body');
const convert = require('koa-convert');
const db = require('./libs/database');
const utils = require('./libs/utils')

const app = new Koa()
app.use(static('./static'))
app.listen(8080)

app.use(convert(body()));

ejs(app, {
  root: './template',
  layout: false,
  viewExt: 'ejs',
  // cache: false,
  // debug: true
});

async function onerror(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.app.emit('error', err);
    ctx.body = 'server error';
    ctx.status = err.status || 500;
  }
}

app.use(async (ctx, next) => {
  await onerror()
  ctx.db = db
  ctx.utils = utils
  await next()
})

const router = new Router();
router.use('/', require('./router/www'))
router.use('/admin', require('./router/admin'))
app.use(router.routes());

