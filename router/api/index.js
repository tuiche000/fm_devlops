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

  console.log('op', op)

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



  // request.post({ url, form: { key: 'value' } }, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log(body) // 请求成功的处理逻辑  
  //   }
  // })

  // httprequest(url,body);

  // function httprequest(url, data) {
  //   request({
  //     url: url,
  //     method: "POST",
  //     json: true,
  //     headers: ctx.headers,
  //     body: data
  //   }, function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       console.log('bodybodybodybodybodybodybodybodybodybodybody:', body) // 请求成功的处理逻辑
  //     }
  //   });
  // };

  // console.log(JSON.parse(body))
  // console.log(typeof JSON.parse(body))


  // let buffer = await fetch({
  //   url,
  //   body: JSON.parse(body),
  //   headers: ctx.headers,
  //   method: 'POST',
  //   postdata: body
  // });
  // console.log('res_buffer', buffer)
  // let json = JSON.parse(buffer.toString());

  // ctx.body = {
  //   msg: 'ok', data: { a: '123', b: '456' }, status: 200
  // }



})

module.exports = router.routes()