const { createRoom, closeRoom, getRoom, getRooms } = require('./RedisUtil')
const _ = require('lodash')


class Websockets {
    connection(client) {
        console.log('a user connected')
        var list = []
        var rooms = []

        client.emit("getRooms", () => {
            getRooms((err,data) => {
                if(data){
                    list = _.flattenDeep(data)
                }
            })

            list.map(key => {
                getRoom(key, (err, result) => {
                    rooms.push(result) 
                })
            })
        })

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
    }
}

module.exports = new Websockets()