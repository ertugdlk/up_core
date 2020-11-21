const { createRoom, closeRoom, getRoom, getRooms } = require('./RedisUtil')
const _ = require('lodash')
var clients = []

io.engine.generateId = (req) => {
    return "custom:id:" + 1++; // custom id must be unique
  }

class Websockets {

    connection(client) {
        client.on('client_info' , (data) => {
            client.id = data
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