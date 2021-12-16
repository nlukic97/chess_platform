function Router(app, __dir){
    app.get('/',(req,res)=> res.sendFile(`${__dir}/public/index.html`))
    app.get('/login', (req,res)=> res.sendFile(`${__dir}/public/login.html`)) // why does this work?
    app.get('/users',(req,res)=> res.status(403).send({errorCode:'1234'}))
    app.get('*',(req,res)=> res.status('404').end('Not found.'))
}

module.exports = { Router }