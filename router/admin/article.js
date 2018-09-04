const Router = require('koa-router')

let router = new Router()

router.get('/', async ctx => {
  let informations = await ctx.db.query(`SELECT * FROM informations ORDER BY submit_time`)
  let categories2 = await ctx.db.query(`SELECT * FROM categories WHERE pid=${2} ORDER BY \`rank\``)
  await ctx.render('./admin/article', {
    categories2,
    informations
  })
})

router.get('/del', async ctx => {
  let id = ctx.query.id
  await ctx.db.delete('informations', {
    "id": id
  })
  await ctx.redirect('/admin/article')
})

router.get('/edit', async ctx => {
  let id = ctx.query.id
  const row = await ctx.db.query(`SELECT id,title,category_id,category_name,content,api_import,api_export,submit_time FROM informations WHERE id='${id}'`)
  let categories2 = await ctx.db.query(`SELECT * FROM categories WHERE pid=${2} ORDER BY \`rank\``)
  await ctx.render('/admin/article_edit', {
    body: row[0],
    categories2
  })
})

router.post('/', async ctx => {
  let { title, category, method, api, api_import, api_export } = ctx.request.fields
  // 分类转换成对象
  category = JSON.parse(category)
  if (title && category && method && api && api_import && api_export) {
    let id = ctx.utils.uuid()
    let submit_time = Math.round(new Date().getTime() / 1000)
    let new_content = {
      method,
      api,
    }
    new_content = JSON.stringify(new_content)

    let informations = {
      id,
      title,
      category_id: category.id,
      category_name: category.name,
      content: new_content,
      api_import,
      api_export,
      submit_time: submit_time,
    }
    const row = await ctx.db.insert('informations', informations)
    if (row) {
      await ctx.redirect('/admin/article')
    }
  } else {
    ctx.body = '请填写所有的表单字段'
  }
})

router.post('/edit', async ctx => {
  let { id, title, category, method, api, api_import, api_export } = ctx.request.fields
  // 分类转换成对象
  category = JSON.parse(category)
  if (title && category && method && api && api_import && api_export) {
    let submit_time = Math.round(new Date().getTime() / 1000)
    let new_content = {
      method,
      api,
    }
    new_content = JSON.stringify(new_content)

    let informations = {
      title,
      category_id: category.id,
      category_name: category.name,
      content: new_content,
      api_import,
      api_export,
      submit_time: submit_time,
    }
    const row = await ctx.db.update('informations', id, informations)
    if (row) {
      await ctx.redirect('/admin/article')
    }
  } else {
    ctx.body = '请填写所有的表单字段'
  }
})

module.exports = router.routes()