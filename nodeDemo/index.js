let http = require('http')

let httpServer = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.write('buffer data')
    setTimeout(() => {
        res.end('Hello World!\n')
    }, 10 * 1000);
})
httpServer.listen(5555, '127.0.0.1')
console.log('Server running at http://127.0.0.1:5555/')

