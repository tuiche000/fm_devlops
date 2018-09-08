const Router = require('koa-router');

let router = new Router();

router.get('/', async (ctx, next) => {

  ctx.redirect('/api')

})

router.get('api', async (ctx, next) => {

  let curInfo = ['']
  if (ctx.query.infoId) {
    let infoId = ctx.query.infoId
    curInfo = await ctx.db.query(`SELECT id,title,category_id,category_name,content,api_import,api_export,submit_time FROM informations WHERE id='${infoId}'`)
    if (curInfo.length == 0) {
      ctx.redirect('/')
      return
    }
  }
  let categories = await ctx.db.query(`SELECT * FROM \`categories\` WHERE \`pid\`=${1} ORDER BY \`rank\``)
  let categories2 = await ctx.db.query(`SELECT * FROM categories WHERE pid=${2} ORDER BY \`rank\``)
  let info = await ctx.db.query(`SELECT * FROM informations`)

  await ctx.render('./www/index', {
    categories: categories,
    categories2: categories2,
    info: info,
    curInfo: curInfo[0]
  })


})

module.exports = router.routes();