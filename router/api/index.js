const Router = require('koa-router')
const fetch = require('../../libs/fetch-html-blue');

let router = new Router()

router.get('/request', async ctx => {
  let { url } = ctx.query
  // console.log(ctx.header)

  let buffer = await fetch({
    url,
    headers: ctx.headers
  });
  let json=JSON.parse(buffer.toString());

  ctx.body = {
    msg: 'ok', data: json, status: 200
  }
})

module.exports = router.routes()