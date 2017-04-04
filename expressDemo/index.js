var express = require('express')
var appData = require('./data.json')

var app = express()
var router = express.Router()

router.get('/', function (req, res, next) {
    req.url = '/index.html'
    next()
})

app.use(router)

var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings
var apiRoutes = express.Router()

apiRoutes.get('/seller', function (req, res) {
    console.log('seller')
    res.json({
        errno: 0,
        data: seller
    })
})
apiRoutes.post('/seller', function (req, res) {
    console.log('seller')
    res.json({
        errno: 0,
        data: seller
    })
})

apiRoutes.get('/goods', function (req, res) {
    console.log('goods')
    res.json({
        errno: 0,
        data: goods
    })
})

apiRoutes.get('/ratings', function (req, res) {
    console.log('ratings')
    res.json({
        errno: 0,
        data: ratings
    })
})

app.use('/api', apiRoutes)
app.use(express.static('./static'))

module.exports = app.listen('8080', function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + 8080 + '\n')
})