const Router = require('koa-router')
const fetch = require('../../libs/fetch-html-blue');
const request = require('request');

let router = new Router()

router.get('/request', async ctx => {
  let { url } = ctx.query

  let buffer = await fetch({
    url,
    headers: ctx.headers
  });
  let json = JSON.parse(buffer.toString());

  ctx.body = {
    msg: 'ok', data: json, status: 200
  }
})


router.post('/request', async ctx => {

  let { url, body } = ctx.request.fields
  ctx.headers['content-type'] = "application/json"

  body = JSON.parse(body)
  let op = {
    url: url,
    method: "POST",
    json: true,
    headers: {
      "content-type": "application/json",
      "pi": ctx.headers['pi'],
      "channel": ctx.headers['channel'],
    },
    body: body
  }

  function requestAsync() {
    return new Promise((reslove, reject) => {
      request(op, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          reslove(body)
        } else {
          reject(error)
        }
      });
    })
  }

  let res = await requestAsync()

  ctx.body = res
  

})

module.exports = router.routes()