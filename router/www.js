const Router = require('koa-router');

let router = new Router();

router.get('/', async (ctx, next) => {

  let categories = await ctx.db.query(`SELECT * FROM categories ORDER BY rank`)
  console.log(categories)
  
  await ctx.render('./www/index', {
    categories: categories
  })

})

module.exports = router.routes();