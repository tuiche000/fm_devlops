const Router = require('koa-router');

let router = new Router();

router.get('/', async ctx => {
  await ctx.render('./admin/nav')
})

router.post('/', async ctx => {
  let { name, pid, rank, is_hide, is_display } = ctx.request.fields
  if(name && pid && rank && is_hide && is_display) {
    let id = ctx.utils.uuid()
    console.log(id)
    let categories = {
      id,
      name,
      pid,
      rank,
      is_hide,
      is_display,
    }
    const row = await ctx.db.insert('categories', categories)
    if (row) {
      console.log('添加成功？')
      ctx.body = '添加成功'
    }  
  } else {
    ctx.body = '请填写所有的表单字段'
  }
})

module.exports = router.routes();