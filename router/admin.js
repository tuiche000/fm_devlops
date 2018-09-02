const Router = require('koa-router')

let router = new Router()

//进入所有的admin相关的页面之前(除了"/admin/login")，都要校验用户身份——如果没登录过，滚去登陆(/admin/login)
router.use(async (ctx, next) => {
  if (ctx.path != '/admin/login') {
    await ctx.redirect(`/admin/login?ref=${ctx.url}`)
    return
  }
  await next()
  // if (!req.cookies['admin_token'] && req.path != '/login') {
  //   res.redirect(`/admin/login?ref=${req.url}`)
  // } else {
  //   if (req.path == '/login') {
  //     next()
  //   } else {
  //     req.db.query(`SELECT * FROM admin_token_table WHERE ID='${req.cookies['admin_token']}'`, (err, data) => {
  //       if (err) {
  //         console.log(err)
  //         res.sendStatus(500)
  //       } else if (data.length == 0) {
  //         res.redirect(`/admin/login?ref=${req.url}`)
  //       } else {
  //         req.admin_ID = data[0]['admin_ID']
  //         next()
  //       }
  //     })
  //   }
  // }
})
router.get('/', async ctx => {
  let categories = await ctx.db.query(`SELECT * FROM categories ORDER BY \`pid\`,\`rank\``)
  await ctx.render('./admin/nav', {
    categories
  })
})
router.get('/login', async ctx => {
  let source_path = ctx.query.ref
  await ctx.render('./admin/login', {
    source_path
  })
})
router.get('/del', async ctx => {
  let id = ctx.query.id
  await ctx.db.delete('categories', {
    "id": id
  })
  await ctx.db.delete('informations', {
    "category_id": id
  })
  await ctx.redirect('/admin')
})
router.get('/article', async ctx => {
  let informations = await ctx.db.query(`SELECT * FROM informations ORDER BY submit_time`)
  let categories2 = await ctx.db.query(`SELECT * FROM categories WHERE pid=${2} ORDER BY \`rank\``)
  await ctx.render('./admin/article', {
    categories2,
    informations
  })
})
router.get('/article/del', async ctx => {
  let id = ctx.query.id
  await ctx.db.delete('informations', {
    "id": id
  })
  await ctx.redirect('/admin/article')
})
router.get('/article/edit', async ctx => {
  let id = ctx.query.id
  const row = await ctx.db.query(`SELECT id,title,category_id,category_name,content,api_import,api_export,submit_time FROM informations WHERE id='${id}'`)
  let categories2 = await ctx.db.query(`SELECT * FROM categories WHERE pid=${2} ORDER BY \`rank\``)
  await ctx.render('/admin/article_edit', {
    body: row[0],
    categories2
  })
})


router.post('/', async ctx => {
  let { name, pid, rank, is_hide, is_display } = ctx.request.fields
  if (name && pid && rank && is_hide && is_display) {
    let id = ctx.utils.uuid()
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
      await ctx.redirect('/admin/')
    }
  } else {
    ctx.body = '请填写所有的表单字段'
  }
})
router.post('/login', async ctx => {
  let { user, pwd } = ctx.request.fields
  let row = await ctx.db.query(`SELECT id,user_name,password FROM users WHERE user_name='${user}'`)
  if (row.length == 0) {
    console.log('没有这个用户，或密码错误')
    return
  }
  if (row[0].password == pwd) {
    console.log('登陆OK') 
    return
  }
  console.log('用户名或密码错误') 
})
router.post('/article', async ctx => {
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
router.post('/article/edit', async ctx => {
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