var express = require('express')

var app = express()

app.use('/build', express.static(__dirname + '/build'));

app.get('*', function(req, res, next) {
  res.sendFile(__dirname + '/views/index.html')
})

var port = process.env.PORT || 3000

app.listen(port, function() {
    console.log('Listening on port %s', port)
})