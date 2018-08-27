const Router = require('koa-router');

let router = new Router();

router.get('/', async (ctx, next) => {

  let categories = await ctx.db.query(`SELECT * FROM categories WHERE pid=${1} ORDER BY rank`)
  let categories2 = await ctx.db.query(`SELECT * FROM categories WHERE pid=${2} ORDER BY rank`)
    
  await ctx.render('./www/index', {
    categories: categories,
    categories2: categories2,
  })

})

module.exports = router.routes();