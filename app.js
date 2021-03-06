const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const ejs = require('koa-ejs')
const body = require('koa-better-body')
const convert = require('koa-convert')
const db = require('./libs/database')
const utils = require('./libs/utils')

const app = new Koa()
app.listen(8080)
app.keys = ['im a newer secret', 'i like turtle']

app.use(async (ctx, next) => {
  ctx.db = db
  ctx.utils = utils
  await next()
})

app.use(static('./static'))
app.use(convert(body(
  {
    textLimit: '2048kb',
    formLimit: '2048kb',
  }
)))

ejs(app, {
  root: './template',
  layout: false,
  viewExt: 'ejs',
  // cache: false,
  // debug: true
})

const router = new Router()
router.use('/', require('./router/www'))
router.use('/admin', require('./router/admin'))
router.use('/api', require('./router/api'))
app.use(router.routes())

