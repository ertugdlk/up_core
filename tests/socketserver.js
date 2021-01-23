
const express = require('express')
    , app = express()
    , port = process.env.PORT || 3000
    , http = require('http').Server(app)
    , io = require('socket.io')(http)
/*
    , Websockets = require('../utils/Websockets')



global.io = io
global.io.on("connection", Websockets.connection)
*/

io.on('connection', function (socket) {
    socket.on('message', function (msg) {
        io.sockets.emit('message', msg)
    })

    socket.on('login', function (nickname) {
        io.sockets.emit('login', nickname)
    })
})
module.exports = { http }