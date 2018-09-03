const Koa = require('koa')

const app = new Koa()
app.listen(80)

app.use(async (ctx, next) => {

    
    ctx.cookies.set('admin_token', 'abc123', {
        maxAge: 20 * 60 * 1000,
        signed: true,
    })
  
    ctx.body = ctx.cookies.get('admin_token', {signed: true})
})