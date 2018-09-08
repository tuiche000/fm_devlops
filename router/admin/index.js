const Router = require('koa-router')

let router = new Router()

//进入所有的admin相关的页面之前(除了"/admin/login")，都要校验用户身份——如果没登录过，滚去登陆(/admin/login)
router.use(async (ctx, next) => {
  if (ctx.path != '/admin/login' && !ctx.cookies.get('admin_token', { signed: true })) {
    await ctx.redirect(`/admin/login?ref=${ctx.url}`)
    return
  }
  if (ctx.path == '/admin/login') {
    await next()
    return
  }
  let token_row = await ctx.db.query(`SELECT * FROM admin_token WHERE ID='${ctx.cookies.get('admin_token', { signed: true })}'`)
  if (token_row.length == 0) {
    await ctx.redirect(`/admin/login?ref=${ctx.url}`)
    return
  }
  ctx.admin_ID = token_row[0]['admin_ID'];
  await next();
})
router.get('/login', async ctx => {
  let source_path = ctx.query.ref
  await ctx.render('./admin/login', {
    source_path
  })
})
router.use('/article', require('./article'))
router.get('/', async ctx => {
  let categories = await ctx.db.query(`SELECT * FROM categories ORDER BY \`pid\`,\`rank\``)
  await ctx.render('./admin/nav', {
    categories
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
router.post('/', async ctx => {
  let { name, pid, path, rank, is_hide, is_display } = ctx.request.fields
  if (name && pid && rank && is_hide && is_display) {
    let id = ctx.utils.uuid()
    let categories = {
      id,
      name,
      pid,
      path,
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
    ctx.body = '没有这个用户，或密码错误'
    return
  }
  if (row[0].password == pwd) {

    let ID = ctx.utils.uuid();

    let oDate = new Date();
    oDate.setMinutes(oDate.getMinutes() + 20);

    let t = Math.floor(oDate.getTime() / 1000);

    let token = {
      ID,
      admin_id: row[0].id,
      expires: t
    }

    await ctx.db.insert('admin_token', token)
    ctx.cookies.set('admin_token', ID, {
      maxAge: 20 * 60 * 1000,
      signed: true,
    })

    let ref = ctx.query['ref'];
    if (!ref) {
      ref = '';
    }
    await ctx.redirect(ref)
    return
  }
  ctx.body = '用户名或密码错误'
})


module.exports = router.routes()