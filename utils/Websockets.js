const { createRoom, closeRoom, getRoom, getRooms } = require('./RedisUtil')
const _ = require('lodash')
var clients = []

class Websockets {
    connection(client) {
        client.on('client_info' , (data) => {
            client.id = '123'
        })

        console.log(client.id + ' user connected')
        
        client.emit("rooms", 'deneme')

        client.on("create", (gameData) => {
            const returnMessage = createRoom(client.id, gameData)
            const rooms = getRooms()
            client.emit("createReturn", (returnMessage))
        })

        client.on("join", (socketId) => {
            client.to("socketId")
        })

        client.on("close", () => {
            closeRoom(client.id)
        })

        client.on('disconnect', () => {
            console.log(client.id + ' disconnected')
        })
    }
}

module.exports = new Websockets()